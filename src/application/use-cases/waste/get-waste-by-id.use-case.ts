import { Inject, Injectable, Logger } from '@nestjs/common'

import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { WasteDto } from '../../dtos/waste/waste.dto'
import { WasteMapper } from '../../mapper/waste.mapper'

import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { WASTE_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

@Injectable()
export class GetWasteByIdUseCase {
  private readonly logger = new Logger(GetWasteByIdUseCase.name)

  constructor(
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
  ) {}

  async execute(wasteId: string): Promise<ReturnBaseDTO<WasteDto>> {
    try {
      this.logger.log(`Getting waste with ID: ${wasteId}`)

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

      const wasteDto = WasteMapper.toDto(waste)

      return {
        success: true,
        data: wasteDto,
        message: 'Resíduo encontrado com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(`Error getting waste: ${error}`)

      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
