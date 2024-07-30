import { CreateUserDto } from '@/application/dtos/user/create-user.dto'
import { CreateUserUseCase } from '@/application/user-cases/create-user.use-case'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller({
  path: 'user',
})
@ApiTags('user')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() request: CreateUserDto) {
    return await this.createUserUseCase.execute(request)
  }
}
