import { UseCase } from '../use-case.interface'
import { Injectable, Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { AddressRepositoryInterface } from '../../../domain/repositories/address-repository.interface'
import { AddressDto } from '../../dtos/address/address.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { AddressMapper } from '../../mapper/address.mapper'
import { ADDRESS_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

@Injectable()
export class GetAddressByIdUseCase
  implements UseCase<string, ReturnBaseDTO<AddressDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: AddressRepositoryInterface,
  ) {}

  async execute(id: string): Promise<ReturnBaseDTO<AddressDto>> {
    this.logger.info('[Address] GetAddressByIdUseCase.execute - id', { id })
    const vm = new ReturnBaseDTO<AddressDto>()
    try {
      const address = await this.addressRepository.findById(id)
      if (!address) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'Address not found'
        vm.success = false
        this.logger.warn('[Address] GetAddressByIdUseCase.notFound', { id })
        return vm
      }
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Address fetched successfully'
      vm.success = true
      vm.data = AddressMapper.toDto(address)
      this.logger.info('[Address] GetAddressByIdUseCase.success', {
        address: vm.data,
      })
    } catch (error) {
      this.logger.error('[Address] GetAddressByIdUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error fetching address'
      vm.success = false
    }
    return vm
  }
}
