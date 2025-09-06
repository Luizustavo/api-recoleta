import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CreateAddressDto } from '../../../application/dtos/address/create-address.dto'
import { UpdateAddressDto } from '../../../application/dtos/address/update-address.dto'
import { CreateAddressUseCase } from '../../../application/use-cases/address/create-address.use-case'
import { GetAllAddressesUseCase } from '../../../application/use-cases/address/get-all-addresses.use-case'
import { GetAddressByIdUseCase } from '../../../application/use-cases/address/get-address-by-id.use-case'
import { UpdateAddressUseCase } from '../../../application/use-cases/address/update-address.use-case'
import { DeleteAddressUseCase } from '../../../application/use-cases/address/delete-address.use-case'

@Controller('address')
@ApiTags('address')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AddressController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly getAllAddressesUseCase: GetAllAddressesUseCase,
    private readonly getAddressByIdUseCase: GetAddressByIdUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo endereço' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Request() req: any,
  ) {
    const userId = req.user.id
    const result = await this.createAddressUseCase.execute({
      createAddressDto,
      userId,
    })
    return result
  }

  @Get()
  @ApiOperation({ summary: 'Listar endereços do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de endereços retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(@Request() req: any) {
    const userId = req.user.id
    const result = await this.getAllAddressesUseCase.execute(userId)
    return result
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar endereço por ID' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço encontrado' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string) {
    const result = await this.getAddressByIdUseCase.execute(id)
    return result
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar endereço' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const result = await this.updateAddressUseCase.execute({
      id,
      updateAddressDto,
    })
    return result
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar endereço' })
  @ApiParam({ name: 'id', description: 'ID do endereço' })
  @ApiResponse({ status: 200, description: 'Endereço deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Endereço não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async remove(@Param('id') id: string) {
    const result = await this.deleteAddressUseCase.execute(id)
    return result
  }
}
