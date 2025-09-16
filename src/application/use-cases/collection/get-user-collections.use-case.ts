import { Inject, Injectable, Logger } from '@nestjs/common'

import { PaginationRequest } from '../../dtos/base/pagination-request.dto'
import { PaginationResponse } from '../../dtos/base/pagination-response.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { CollectionDto } from '../../dtos/collection/collection.dto'
import { CollectionMapper } from '../../mapper/collection.mapper'

import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { CollectionRepositoryInterface } from '../../../domain/repositories/collection-repository.interface'
import { COLLECTION_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

interface GetUserCollectionsRequest {
  userId: string
  status?: string
  pagination: PaginationRequest
}

@Injectable()
export class GetUserCollectionsUseCase {
  private readonly logger = new Logger(GetUserCollectionsUseCase.name)

  constructor(
    @Inject(COLLECTION_REPOSITORY_TOKEN)
    private readonly collectionRepository: CollectionRepositoryInterface,
  ) {}

  async execute(
    request: GetUserCollectionsRequest,
  ): Promise<ReturnBaseDTO<PaginationResponse<CollectionDto>>> {
    try {
      const { userId, status, pagination } = request

      this.logger.log(
        `Getting collections for user ${userId} with status ${status || 'all'}`,
      )

      const collections = await this.collectionRepository.findAllByCollectorId(
        userId,
        {
          status,
          page: pagination.page,
          limit: pagination.limit,
        },
      )

      const collectionsDto = collections.map((collection) =>
        CollectionMapper.toDto(collection),
      )

      const response: PaginationResponse<CollectionDto> = {
        items: collectionsDto,
        totalItems: collectionsDto.length, // Para simplificar, usando o length. Em produção seria melhor ter um count separado
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        totalPages: Math.ceil(collectionsDto.length / (pagination.limit || 10)),
      }

      return {
        success: true,
        data: response,
        message: 'Coletas listadas com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(
        `Error getting user collections: ${error.message}`,
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
