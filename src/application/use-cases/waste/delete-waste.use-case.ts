import { Inject, Injectable, Logger } from '@nestjs/common'

import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'

import { ReturnCodeEnum } from '../../../domain/enums/return-code.enum'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { WASTE_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

interface DeleteWasteRequest {
  wasteId: string
  userId: string
}

@Injectable()
export class DeleteWasteUseCase {
  private readonly logger = new Logger(DeleteWasteUseCase.name)

  constructor(
    @Inject(WASTE_REPOSITORY_TOKEN)
    private readonly wasteRepository: WasteRepositoryInterface,
  ) {}

  async execute(request: DeleteWasteRequest): Promise<ReturnBaseDTO<null>> {
    try {
      const { wasteId, userId } = request
      this.logger.log(`Deleting waste ${wasteId} for user ${userId}`)

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
          `User ${userId} not authorized to delete waste ${wasteId}`,
        )
        return {
          success: false,
          data: null,
          message: 'Não autorizado',
          code: ReturnCodeEnum.InternalError,
        }
      }

      await this.wasteRepository.delete(wasteId)

      this.logger.log(`Deleted waste with ID: ${wasteId}`)

      return {
        success: true,
        data: null,
        message: 'Resíduo excluído com sucesso',
        code: ReturnCodeEnum.Success,
      }
    } catch (error) {
      this.logger.error(`Error deleting waste: ${error}`)

      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor',
        code: ReturnCodeEnum.InternalError,
      }
    }
  }
}
