import { UseCase } from '../use-case.interface'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { UpdateUserDto } from '../../dtos/user/update-user.dto'
import { UserDto } from '../../dtos/user/user.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { UserMapper } from '../../mapper/user.mapper'

export class UpdateUserUseCase
  implements
    UseCase<{ id: string; data: UpdateUserDto }, ReturnBaseDTO<UserDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: {
    id: string
    data: UpdateUserDto
  }): Promise<ReturnBaseDTO<UserDto>> {
    this.logger.info('[User] UpdateUserUseCase.execute - params', { params })
    const vm = new ReturnBaseDTO<UserDto>()
    try {
      const updated = await this.userRepository.updateAsync(
        params.id,
        params.data,
      )
      if (!updated) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'User not found'
        vm.success = false
        this.logger.warn('[User] UpdateUserUseCase.notFound', { id: params.id })
        return vm
      }
      vm.code = ReturnCodeEnum.Success
      vm.message = 'User updated successfully'
      vm.success = true
      vm.data = UserMapper.toDto(updated)
      this.logger.info('[User] UpdateUserUseCase.success', { user: vm.data })
    } catch (error) {
      this.logger.error('[User] UpdateUserUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error updating user'
      vm.success = false
    }
    return vm
  }
}
