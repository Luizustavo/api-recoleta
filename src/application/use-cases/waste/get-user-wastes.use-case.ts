import { Inject, Injectable, Logger } from '@nestjs/common'

import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { WasteDto } from '../../dtos/waste/waste.dto'
import { WasteMapper } from '../../mapper/waste.mapper'
import { PaginationRequest } from '../../dtos/base/pagination-request.dto'
import { PaginationResponse } from '../../dtos/base/pagination-response.dto'

import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { WASTE_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

interface GetUserWastesRequest {
  userId: string
  pagination?: PaginationRequest
}

@Injectable()
export class GetUserWastesUseCase {
  private readonly logger = new Logger(GetUserWastesUseCase.name)

  constructor(
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
  ) {}

  async execute(
    request: GetUserWastesRequest,
  ): Promise<ReturnBaseDTO<PaginationResponse<WasteDto>>> {
    try {
      const { userId, pagination } = request
      this.logger.log(`Getting wastes for user ${userId}`)

      // Buscar todos os resíduos do usuário
      const allWastes = await this.wasteRepository.findAllByUserId(userId)

      // Converter para DTOs
      const wasteDtos = allWastes.map((waste) => WasteMapper.toDto(waste))

      // Aplicar paginação - garantir valores padrão
      const page = pagination?.page || 1
      const limit = pagination?.limit || 10

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedWastes = wasteDtos.slice(startIndex, endIndex)

      // Criar resposta paginada
      const paginationResponse = new PaginationResponse<WasteDto>()
      paginationResponse.items = paginatedWastes
      paginationResponse.page = page
      paginationResponse.limit = limit
      paginationResponse.totalItems = wasteDtos.length
      paginationResponse.totalPages = Math.ceil(wasteDtos.length / limit)

      this.logger.log(
        `Found ${allWastes.length} total wastes for user ${userId}, returning ${paginatedWastes.length}`,
      )

      return {
        success: true,
        data: paginationResponse,
        message: 'Resíduos do usuário encontrados com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(`Error getting user wastes: ${error}`)

      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
