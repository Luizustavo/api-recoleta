import { ReturnBaseDTO } from '@/application/dtos/base/return-base.dto'
import { CreateUserDto } from '@/application/dtos/user/create-user.dto'
import { UserDto } from '@/application/dtos/user/user.dto'
import { CreateUserUseCase } from '@/application/user-cases/create-user.use-case'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

@Controller({
  path: 'grpc/user',
  version: '1',
})
export class GrpcUserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @GrpcMethod('UserService')
  async CreateLoadTable(
    request: CreateUserDto,
  ): Promise<ReturnBaseDTO<UserDto>> {
    return await this.createUser.execute(request)
  }
}
