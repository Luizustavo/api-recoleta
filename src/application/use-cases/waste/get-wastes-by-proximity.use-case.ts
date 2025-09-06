import { Injectable, Logger } from '@nestjs/common'
import { WasteRepositoryInterface } from '../../../domain/repositories/waste-repository.interface'
import { WasteEntity } from '../../../domain/entities/waste.entity'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { PaginationRequest } from '../../dtos/base/pagination-request.dto'

interface ProximityFilters {
  latitude: number
  longitude: number
  radiusKm?: number
  wasteType?: string
  condition?: string
}

interface ProximityRequest {
  filters: ProximityFilters
  pagination: PaginationRequest
}

@Injectable()
export class GetWastesByProximityUseCase {
  private readonly logger = new Logger(GetWastesByProximityUseCase.name)

  constructor(private readonly wasteRepository: WasteRepositoryInterface) {}

  async execute(
    request: ProximityRequest,
  ): Promise<ReturnBaseDTO<WasteEntity[]>> {
    const vm = new ReturnBaseDTO<WasteEntity[]>()

    try {
      const radiusKm = request.filters.radiusKm || 10

      this.logger.log(
        `Getting wastes by proximity: lat=${request.filters.latitude}, lng=${request.filters.longitude}, radius=${radiusKm}km`,
      )

      // Usar o método existente do repositório
      const filters = {
        ...(request.filters.wasteType && {
          wasteType: request.filters.wasteType,
        }),
        latitude: request.filters.latitude,
        longitude: request.filters.longitude,
        maxDistance: radiusKm,
        page: request.pagination.page,
        limit: request.pagination.limit,
      }

      const wastes = await this.wasteRepository.findAvailable(filters)

      vm.data = wastes
      vm.success = true
      vm.message = `Found ${wastes.length} wastes within ${radiusKm}km radius`

      this.logger.log(
        `Found ${wastes.length} wastes within ${radiusKm}km radius`,
      )
      return vm
    } catch (error) {
      this.logger.error(
        `Error getting wastes by proximity: ${error.message}`,
        error.stack,
      )
      vm.success = false
      vm.message = 'Error getting wastes by proximity'
      return vm
    }
  }
}
