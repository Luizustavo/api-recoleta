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
export class GetAllAddressesUseCase
  implements UseCase<string, ReturnBaseDTO<AddressDto[]>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: AddressRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<ReturnBaseDTO<AddressDto[]>> {
    this.logger.info('[Address] GetAllAddressesUseCase.execute - userId', {
      userId,
    })
    const vm = new ReturnBaseDTO<AddressDto[]>()
    try {
      const addresses = await this.addressRepository.findAllByUserId(userId)
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Addresses fetched successfully'
      vm.success = true
      vm.data = addresses.map((address) => AddressMapper.toDto(address))
      this.logger.info('[Address] GetAllAddressesUseCase.success', {
        addressesCount: vm.data.length,
      })
    } catch (error) {
      this.logger.error('[Address] GetAllAddressesUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error fetching addresses'
      vm.success = false
    }
    return vm
  }
}
