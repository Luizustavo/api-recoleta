import { Injectable, Logger } from '@nestjs/common'
import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'
import * as sharp from 'sharp'

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name)
  private blobServiceClient: BlobServiceClient
  private containerName = process.env.AZURE_STORAGE_CONTAINER || 'waste-images'

  constructor() {
    if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING não configurada')
    }
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    )
  }

  async uploadBase64Image(base64: string, folder = 'wastes'): Promise<string> {
    try {
      const buffer = Buffer.from(base64, 'base64')

      const { format } = await sharp(buffer).metadata()

      if (!format) {
        throw new Error('Não foi possível detectar o formato da imagem')
      }

      const mimeType = `image/${format}`
      const extension = format

      const blobName = `${folder}/${uuidv4()}.${extension}`
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      )
      const blockBlobClient = containerClient.getBlockBlobClient(blobName)

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType },
      })

      return blobName
    } catch (error) {
      this.logger.error('Erro ao enviar imagem para Blob Storage', error)
      throw error
    }
  }

  // Helper
  private async streamToBuffer(
    readableStream: NodeJS.ReadableStream,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      readableStream.on('data', (data) => chunks.push(data))
      readableStream.on('end', () => resolve(Buffer.concat(chunks)))
      readableStream.on('error', reject)
    })
  }

  async downloadBlob(blobName: string): Promise<Buffer> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    )
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const exists = await blockBlobClient.exists()
    if (!exists) {
      throw new Error(`Blob "${blobName}" não encontrado.`)
    }

    const downloadResponse = await blockBlobClient.download()

    if (!downloadResponse.readableStreamBody) {
      throw new Error(`Erro ao baixar blob: stream não disponível`)
    }

    const chunks: Buffer[] = []
    for await (const chunk of downloadResponse.readableStreamBody) {
      // Garante que chunk seja um Buffer
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    return Buffer.concat(chunks)
  }
}
