import { UseCase } from '../use-case.interface'
import { Injectable, Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { AddressRepositoryInterface } from '../../../domain/repositories/address-repository.interface'
import { UpdateAddressDto } from '../../dtos/address/update-address.dto'
import { AddressDto } from '../../dtos/address/address.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { AddressMapper } from '../../mapper/address.mapper'
import { ADDRESS_REPOSITORY_TOKEN } from '../../../infrastructure/persistence/constants'

interface UpdateAddressRequest {
  id: string
  updateAddressDto: UpdateAddressDto
}

@Injectable()
export class UpdateAddressUseCase
  implements UseCase<UpdateAddressRequest, ReturnBaseDTO<AddressDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: AddressRepositoryInterface,
  ) {}

  async execute(
    request: UpdateAddressRequest,
  ): Promise<ReturnBaseDTO<AddressDto>> {
    this.logger.info('[Address] UpdateAddressUseCase.execute - request', {
      request,
    })
    const vm = new ReturnBaseDTO<AddressDto>()
    try {
      const updatedAddress = await this.addressRepository.update(
        request.id,
        request.updateAddressDto,
      )
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Address updated successfully'
      vm.success = true
      vm.data = AddressMapper.toDto(updatedAddress)
      this.logger.info('[Address] UpdateAddressUseCase.success', {
        address: vm.data,
      })
    } catch (error) {
      this.logger.error('[Address] UpdateAddressUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error updating address'
      vm.success = false
    }
    return vm
  }
}
