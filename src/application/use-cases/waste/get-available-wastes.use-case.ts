import { Inject, Injectable, Logger } from '@nestjs/common'

import { PaginationRequest } from '../../dtos/base/pagination-request.dto'
import { PaginationResponse } from '../../dtos/base/pagination-response.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { WasteDto } from '../../dtos/waste/waste.dto'
import { WasteMapper } from '../../mapper/waste.mapper'

import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { WASTE_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

interface GetAvailableWastesRequest {
  filters?: {
    wasteType?: string
    location?: string
    condition?: string
  }
  pagination: PaginationRequest
  userId?: string
}

@Injectable()
export class GetAvailableWastesUseCase {
  private readonly logger = new Logger(GetAvailableWastesUseCase.name)

  constructor(
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
  ) {}

  async execute(
    request: GetAvailableWastesRequest,
  ): Promise<ReturnBaseDTO<PaginationResponse<WasteDto>>> {
    try {
      this.logger.log(
        `Getting available wastes with filters: ${JSON.stringify(request.filters)}`,
      )

      const filters = {
        ...request.filters,
        ...(request.userId && { excludeUserId: request.userId }),
      }

      const wastes = await this.wasteRepository.findAvailable(filters)

      const wasteDtos = wastes.map((waste) => WasteMapper.toDto(waste))

      // Aplicar paginação - garantir valores padrão
      const page = request.pagination?.page || 1
      const limit = request.pagination?.limit || 10

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedWastes = wasteDtos.slice(startIndex, endIndex)

      const paginationResponse = new PaginationResponse<WasteDto>()
      paginationResponse.items = paginatedWastes
      paginationResponse.page = page
      paginationResponse.limit = limit
      paginationResponse.totalItems = wasteDtos.length
      paginationResponse.totalPages = Math.ceil(wasteDtos.length / limit)

      return {
        success: true,
        data: paginationResponse,
        message: 'Resíduos disponíveis encontrados com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(`Error getting available wastes: ${error}`)

      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
