import { UseCase } from '../use-case.interface'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { UserDto } from '../../dtos/user/user.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { UserMapper } from '../../mapper/user.mapper'

export class GetAllUsersUseCase
  implements UseCase<{ skip?: number; take?: number }, ReturnBaseDTO<UserDto[]>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: {
    skip?: number
    take?: number
  }): Promise<ReturnBaseDTO<UserDto[]>> {
    this.logger.info('[User] GetAllUsersUseCase.execute - params', { params })
    const vm = new ReturnBaseDTO<UserDto[]>()
    try {
      const users = await this.userRepository.findAllAsync(
        params.skip,
        params.take,
      )
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Users fetched successfully'
      vm.success = true
      vm.data = users.map(UserMapper.toDto)
      this.logger.info('[User] GetAllUsersUseCase.success', {
        count: users.length,
      })
    } catch (error) {
      this.logger.error('[User] GetAllUsersUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error fetching users'
      vm.success = false
    }
    return vm
  }
}
