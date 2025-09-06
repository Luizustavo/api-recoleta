import { UseCase } from '../use-case.interface'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { CreateUserDto } from '../../dtos/user/create-user.dto'
import { UserDto } from '../../dtos/user/user.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import { UserMapper } from '../../mapper/user.mapper'
import * as bcrypt from 'bcrypt'

export class CreateUserUseCase
  implements UseCase<CreateUserDto, ReturnBaseDTO<UserDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: CreateUserDto): Promise<ReturnBaseDTO<UserDto>> {
    this.logger.info('[User] CreateUserUseCase.execute - request', {
      request: { ...request, password: '***' },
    })
    const vm = new ReturnBaseDTO<UserDto>()
    try {
      const hashedPassword = await bcrypt.hash(request.password, 10)
      const user = UserMapper.toEntity({ ...request, password: hashedPassword })
      await this.userRepository.saveAsync(user)
      vm.code = ReturnCodeEnum.Success
      vm.message = 'User created successfully'
      vm.success = true
      vm.data = UserMapper.toDto(user)
      this.logger.info('[User] CreateUserUseCase.success', { user: vm.data })
    } catch (error) {
      this.logger.error('[User] CreateUserUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error creating user'
      vm.success = false
    }
    return vm
  }
}
