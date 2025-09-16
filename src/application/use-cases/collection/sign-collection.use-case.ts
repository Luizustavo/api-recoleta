import { Inject, Injectable, Logger } from '@nestjs/common'

import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { SignCollectionDto } from '../../dtos/collection/sign-collection.dto'
import { CollectionDto } from '../../dtos/collection/collection.dto'
import { CollectionMapper } from '../../mapper/collection.mapper'

import { CollectionEntity } from '../../../domain/entities/collection.entity'
import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { CollectionRepositoryInterface } from '../../../domain/repositories/collection-repository.interface'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import {
  COLLECTION_REPOSITORY_TOKEN,
  WASTE_REPOSITORY_TOKEN,
} from '../../../infrastructure/persistence/constants'

interface SignCollectionRequest {
  signCollectionDto: SignCollectionDto
  userId: string
}

@Injectable()
export class SignCollectionUseCase {
  private readonly logger = new Logger(SignCollectionUseCase.name)

  constructor(
    @Inject(COLLECTION_REPOSITORY_TOKEN)
    private readonly collectionRepository: CollectionRepositoryInterface,
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
  ) {}

  async execute(
    request: SignCollectionRequest,
  ): Promise<ReturnBaseDTO<CollectionDto>> {
    try {
      const { signCollectionDto, userId } = request
      const { wasteId } = signCollectionDto

      this.logger.log(
        `User ${userId} attempting to sign collection for waste ${wasteId}`,
      )

      // 1. Verificar se o resíduo existe
      const waste = await this.wasteRepository.findById(wasteId)
      if (!waste) {
        this.logger.warn(`Waste not found with ID: ${wasteId}`)
        return {
          success: false,
          data: null,
          message: 'Resíduo não encontrado',
          code: ReturnCodeEnum.NotFound,
        }
      }

      // 2. Verificar se o resíduo está disponível
      if (waste.status !== 'AVAILABLE') {
        this.logger.warn(
          `Waste ${wasteId} is not available for collection. Status: ${waste.status}`,
        )
        return {
          success: false,
          data: null,
          message: 'Este resíduo não está mais disponível para coleta',
          code: ReturnCodeEnum.BusinessRule,
        }
      }

      // 3. Verificar se o usuário não é o proprietário do resíduo
      if (waste.userId === userId) {
        this.logger.warn(
          `User ${userId} trying to collect own waste ${wasteId}`,
        )
        return {
          success: false,
          data: null,
          message: 'Você não pode assinar para coletar seu próprio resíduo',
          code: ReturnCodeEnum.BusinessRule,
        }
      }

      // 4. Verificar se o usuário já assinou para este resíduo
      const existingCollection =
        await this.collectionRepository.findByCollectorIdAndWasteId(
          userId,
          wasteId,
        )
      if (existingCollection) {
        this.logger.warn(`User ${userId} already signed for waste ${wasteId}`)
        return {
          success: false,
          data: null,
          message: 'Você já assinou para coletar este resíduo',
          code: ReturnCodeEnum.BusinessRule,
        }
      }

      // 5. Criar a nova coleta
      const collectionEntity = new CollectionEntity({
        collectorId: userId,
        wasteId: wasteId,
        status: 'SIGNED',
        signedAt: new Date(),
      })

      const createdCollection =
        await this.collectionRepository.create(collectionEntity)

      // 6. Atualizar o status do resíduo para SIGNED
      await this.wasteRepository.update(wasteId, { status: 'SIGNED' })

      this.logger.log(`Collection signed successfully: ${createdCollection.id}`)

      return {
        success: true,
        data: CollectionMapper.toDto(createdCollection),
        message: 'Coleta assinada com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(
        `Error signing collection: ${error.message}`,
        error.stack,
      )
      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
