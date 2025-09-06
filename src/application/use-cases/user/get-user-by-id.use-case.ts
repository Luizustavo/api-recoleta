import { UseCase } from '../use-case.interface'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { UserDto } from '../../dtos/user/user.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { UserMapper } from '../../mapper/user.mapper'

export class GetUserByIdUseCase
  implements UseCase<string, ReturnBaseDTO<UserDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<ReturnBaseDTO<UserDto>> {
    this.logger.info('[User] GetUserByIdUseCase.execute - id', { id })
    const vm = new ReturnBaseDTO<UserDto>()
    try {
      const user = await this.userRepository.findByIdAsync(id)
      if (!user) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'User not found'
        vm.success = false
        this.logger.warn('[User] GetUserByIdUseCase.notFound', { id })
        return vm
      }
      vm.code = ReturnCodeEnum.Success
      vm.message = 'User fetched successfully'
      vm.success = true
      vm.data = UserMapper.toDto(user)
      this.logger.info('[User] GetUserByIdUseCase.success', { user: vm.data })
    } catch (error) {
      this.logger.error('[User] GetUserByIdUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error fetching user'
      vm.success = false
    }
    return vm
  }
}
