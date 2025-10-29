import { Controller, Get, Req, Res, Param } from '@nestjs/common';
import { AzureBlobService } from '@/infrastructure/storage/azure-blob.service';
import { Request, Response } from 'express';

@Controller('/waste-image')
export class WasteImageController {
  constructor(private readonly azureBlobService: AzureBlobService) {}

  @Get(':path(*)')
  async getImage(
    @Param('path') path: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {

    try {
      const buffer = await this.azureBlobService.downloadBlob(path);
      const ext = path.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
      res.setHeader('Content-Type', mimeType);
      res.send(buffer);
    } catch (err) {
      console.error('Erro ao buscar imagem:', err.message);
      res.status(404).send('Imagem não encontrada');
    }
  }
}
