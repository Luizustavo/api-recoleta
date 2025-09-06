import { UseCase } from './use-case.interface'
import { Injectable, Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { AddressRepositoryInterface } from '../../domain/repositories/address-repository.interface'
import { CreateAddressDto } from '../dtos/address/create-address.dto'
import { AddressDto } from '../dtos/address/address.dto'
import { ReturnBaseDTO } from '../dtos/base/return-base.dto'
import { AddressMapper } from '../mapper/address.mapper'
import { ADDRESS_REPOSITORY_TOKEN } from '../../infrastructure/persistence/constants'

interface CreateAddressRequest {
  createAddressDto: CreateAddressDto
  userId: string
}

@Injectable()
export class CreateAddressUseCase
  implements UseCase<CreateAddressRequest, ReturnBaseDTO<AddressDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: AddressRepositoryInterface,
  ) {}

  async execute(
    request: CreateAddressRequest,
  ): Promise<ReturnBaseDTO<AddressDto>> {
    this.logger.info('[Address] CreateAddressUseCase.execute - request', {
      request: { ...request, userId: request.userId },
    })
    const vm = new ReturnBaseDTO<AddressDto>()
    try {
      const addressEntity = AddressMapper.toEntity(
        request.createAddressDto,
        request.userId,
      )
      const createdAddress = await this.addressRepository.create(addressEntity)
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Address created successfully'
      vm.success = true
      vm.data = AddressMapper.toDto(createdAddress)
      this.logger.info('[Address] CreateAddressUseCase.success', {
        address: vm.data,
      })
    } catch (error) {
      this.logger.error('[Address] CreateAddressUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error creating address'
      vm.success = false
    }
    return vm
  }
}
