import { CreateUserDto } from '@/application/dtos/user/create-user.dto'
import { UpdateUserDto } from '@/application/dtos/user/update-user.dto'
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserUseCase } from '@/application/user-cases/create-user.use-case'
import { GetAllUsersUseCase } from '@/application/user-cases/get-all-users.use-case'
import { GetUserByIdUseCase } from '@/application/user-cases/get-user-by-id.use-case'
import { UpdateUserUseCase } from '@/application/user-cases/update-user.use-case'
import { DeleteUserUseCase } from '@/application/user-cases/delete-user.use-case'

@Controller({
  path: 'user',
})
@ApiTags('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateUserDto) {
    return await this.createUserUseCase.execute(request)
  }

  @Get()
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    const skipNum = skip ? parseInt(skip, 10) : undefined
    const takeNum = take ? parseInt(take, 10) : undefined

    return await this.getAllUsersUseCase.execute({
      skip: isNaN(skipNum) ? undefined : skipNum,
      take: isNaN(takeNum) ? undefined : takeNum,
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserByIdUseCase.execute(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({ id, data: updateUserDto })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteUserUseCase.execute(id)
  }
}
