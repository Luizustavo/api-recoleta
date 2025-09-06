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

      const wastes = await this.wasteRepository.findAvailable(request.filters)

      const wasteDtos = wastes.map((waste) => WasteMapper.toDto(waste))

      // Simple pagination logic
      const startIndex =
        (request.pagination.page - 1) * request.pagination.limit
      const endIndex = startIndex + request.pagination.limit
      const paginatedWastes = wasteDtos.slice(startIndex, endIndex)

      const paginationResponse = new PaginationResponse<WasteDto>()
      paginationResponse.items = paginatedWastes
      paginationResponse.page = request.pagination.page
      paginationResponse.limit = request.pagination.limit
      paginationResponse.totalItems = wasteDtos.length
      paginationResponse.totalPages = Math.ceil(
        wasteDtos.length / request.pagination.limit,
      )

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
