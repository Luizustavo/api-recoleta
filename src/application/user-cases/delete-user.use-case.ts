import { UseCase } from './use-case.interface'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { ReturnBaseDTO } from '../dtos/base/return-base.dto'

export class DeleteUserUseCase implements UseCase<string, ReturnBaseDTO<null>> {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<ReturnBaseDTO<null>> {
    this.logger.info('[User] DeleteUserUseCase.execute - id', { id })
    const vm = new ReturnBaseDTO<null>()
    try {
      const deleted = await this.userRepository.deleteAsync(id)
      if (!deleted) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'User not found'
        vm.success = false
        this.logger.warn('[User] DeleteUserUseCase.notFound', { id })
        return vm
      }
      vm.code = ReturnCodeEnum.Success
      vm.message = 'User deleted successfully'
      vm.success = true
      this.logger.info('[User] DeleteUserUseCase.success', { id })
    } catch (error) {
      this.logger.error('[User] DeleteUserUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error deleting user'
      vm.success = false
    }
    return vm
  }
}
