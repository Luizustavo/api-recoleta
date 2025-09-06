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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case'
import { GetAllUsersUseCase } from '@/application/use-cases/user/get-all-users.use-case'
import { GetUserByIdUseCase } from '@/application/use-cases/user/get-user-by-id.use-case'
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case'
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case'

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
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  async create(@Body() request: CreateUserDto) {
    return await this.createUserUseCase.execute(request)
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({ name: 'skip', required: false, description: 'Número de registros para pular' })
  @ApiQuery({ name: 'take', required: false, description: 'Número de registros para retornar' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    const skipNum = skip ? parseInt(skip, 10) : undefined
    const takeNum = take ? parseInt(take, 10) : undefined

    return await this.getAllUsersUseCase.execute({
      skip: isNaN(skipNum) ? undefined : skipNum,
      take: isNaN(takeNum) ? undefined : takeNum,
    })
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    return await this.getUserByIdUseCase.execute(id)
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({ id, data: updateUserDto })
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    return await this.deleteUserUseCase.execute(id)
  }
}
