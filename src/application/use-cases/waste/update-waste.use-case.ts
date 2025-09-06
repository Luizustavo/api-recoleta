import { Inject, Injectable, Logger } from '@nestjs/common'

import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { UpdateWasteDto } from '../../dtos/waste/update-waste.dto'
import { WasteDto } from '../../dtos/waste/waste.dto'
import { WasteMapper } from '../../mapper/waste.mapper'

import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { WASTE_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

interface UpdateWasteRequest {
  wasteId: string
  updateWasteDto: UpdateWasteDto
  userId: string
}

@Injectable()
export class UpdateWasteUseCase {
  private readonly logger = new Logger(UpdateWasteUseCase.name)

  constructor(
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
  ) {}

  async execute(request: UpdateWasteRequest): Promise<ReturnBaseDTO<WasteDto>> {
    try {
      const { wasteId, updateWasteDto, userId } = request
      this.logger.log(`Updating waste ${wasteId} for user ${userId}`)

      // Check if waste exists and belongs to user
      const existingWaste = await this.wasteRepository.findById(wasteId)

      if (!existingWaste) {
        this.logger.warn(`Waste not found with ID: ${wasteId}`)
        return {
          success: false,
          data: null,
          message: 'Resíduo não encontrado',
          code: ReturnCodeEnum.NotFound,
        }
      }

      if (existingWaste.userId !== userId) {
        this.logger.warn(
          `User ${userId} not authorized to update waste ${wasteId}`,
        )
        return {
          success: false,
          data: null,
          message: 'Não autorizado',
          code: ReturnCodeEnum.InternalError,
        }
      }

      // Update waste
      const updateData: any = {}

      if (updateWasteDto.waste) {
        if (updateWasteDto.waste.tipoResiduo) {
          updateData.wasteType = updateWasteDto.waste.tipoResiduo
        }
        if (updateWasteDto.waste.peso) {
          updateData.weight = updateWasteDto.waste.peso
        }
        if (updateWasteDto.waste.quantidade) {
          updateData.quantity = updateWasteDto.waste.quantidade
        }
        if (updateWasteDto.waste.unidade) {
          updateData.unit = updateWasteDto.waste.unidade
        }
        if (updateWasteDto.waste.condicao) {
          updateData.condition = updateWasteDto.waste.condicao
        }
        if (updateWasteDto.waste.embalagem) {
          updateData.hasPackaging = updateWasteDto.waste.embalagem === 'sim'
        }
        if (
          updateWasteDto.waste.dataDescarte &&
          updateWasteDto.waste.horaDescarte
        ) {
          updateData.discardDate = new Date(
            `${updateWasteDto.waste.dataDescarte}T${updateWasteDto.waste.horaDescarte}`,
          )
        }
        if (updateWasteDto.waste.descricaoAdicional !== undefined) {
          updateData.additionalDescription =
            updateWasteDto.waste.descricaoAdicional
        }
        if (updateWasteDto.waste.imagens !== undefined) {
          updateData.images = updateWasteDto.waste.imagens
        }
      }

      const updatedWaste = await this.wasteRepository.update(
        wasteId,
        updateData,
      )

      this.logger.log(`Updated waste with ID: ${updatedWaste.id}`)

      const wasteDto = WasteMapper.toDto(updatedWaste)

      return {
        success: true,
        data: wasteDto,
        message: 'Resíduo atualizado com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(`Error updating waste: ${error}`)

      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
