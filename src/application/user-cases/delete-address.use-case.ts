import { UseCase } from './use-case.interface'
import { Injectable, Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { AddressRepositoryInterface } from '../../domain/repositories/address-repository.interface'
import { ReturnBaseDTO } from '../dtos/base/return-base.dto'
import { ADDRESS_REPOSITORY_TOKEN } from '../../infrastructure/persistence/constants'

@Injectable()
export class DeleteAddressUseCase
  implements UseCase<string, ReturnBaseDTO<void>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: AddressRepositoryInterface,
  ) {}

  async execute(id: string): Promise<ReturnBaseDTO<void>> {
    this.logger.info('[Address] DeleteAddressUseCase.execute - id', { id })
    const vm = new ReturnBaseDTO<void>()
    try {
      await this.addressRepository.delete(id)
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Address deleted successfully'
      vm.success = true
      this.logger.info('[Address] DeleteAddressUseCase.success', { id })
    } catch (error) {
      this.logger.error('[Address] DeleteAddressUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error deleting address'
      vm.success = false
    }
    return vm
  }
}
