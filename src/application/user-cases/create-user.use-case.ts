import { UseCase } from './use-case.interface'
import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { UserDto } from '../dtos/user/user.dto'
import { ReturnBaseDTO } from '../dtos/base/return-base.dto'
import { UserMapper } from '../mapper/user.mapper'

export class CreateUserUseCase
  implements UseCase<CreateUserDto, ReturnBaseDTO<UserDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: CreateUserDto): Promise<ReturnBaseDTO<UserDto>> {
    this.logger.info('CreateAcquirerUseCase.execute', request)

    const user = UserMapper.toEntity(request)
    await this.userRepository.saveAsync(user)

    const vm = new ReturnBaseDTO<UserDto>()
    vm.code = ReturnCodeEnum.Success
    vm.message = 'User created successfully'
    vm.success = true
    vm.data = UserMapper.toDto(user)

    return vm
  }
}
