import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CreateWasteDto } from '../../../application/dtos/waste/create-waste.dto'
import { UpdateWasteDto } from '../../../application/dtos/waste/update-waste.dto'
import { PaginationRequest } from '../../../application/dtos/base/pagination-request.dto'

import { CreateWasteUseCase } from '../../../application/use-cases/waste/create-waste.use-case'
import { GetWasteByIdUseCase } from '../../../application/use-cases/waste/get-waste-by-id.use-case'
import { GetAvailableWastesUseCase } from '../../../application/use-cases/waste/get-available-wastes.use-case'
import { GetUserWastesUseCase } from '../../../application/use-cases/waste/get-user-wastes.use-case'
import { UpdateWasteUseCase } from '../../../application/use-cases/waste/update-waste.use-case'
import { DeleteWasteUseCase } from '../../../application/use-cases/waste/delete-waste.use-case'

@ApiTags('waste')
@Controller('waste')
export class WasteController {
  constructor(
    private readonly createWasteUseCase: CreateWasteUseCase,
    private readonly getWasteByIdUseCase: GetWasteByIdUseCase,
    private readonly getAvailableWastesUseCase: GetAvailableWastesUseCase,
    private readonly getUserWastesUseCase: GetUserWastesUseCase,
    private readonly updateWasteUseCase: UpdateWasteUseCase,
    private readonly deleteWasteUseCase: DeleteWasteUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo resíduo' })
  @ApiResponse({ status: 201, description: 'Resíduo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() createWasteDto: CreateWasteDto, @Request() req: any) {
    const result = await this.createWasteUseCase.execute({
      createWasteDto,
      userId: req.user.id,
    })
    return result
  }

  @Get('my-wastes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar resíduos do usuário logado' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limite de registros por página',
  })
  @ApiResponse({ status: 200, description: 'Lista de resíduos do usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getMyWastes(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = new PaginationRequest()
    pagination.page = page ? Number(page) : 1
    pagination.limit = limit ? Number(limit) : 10

    const result = await this.getUserWastesUseCase.execute({
      userId: req.user.id,
      pagination,
    })
    return result
  }

  @Get('available')
  @ApiOperation({ summary: 'Listar resíduos disponíveis' })
  @ApiQuery({
    name: 'wasteType',
    required: false,
    description: 'Tipo de resíduo',
  })
  @ApiQuery({ name: 'location', required: false, description: 'Localização' })
  @ApiQuery({
    name: 'condition',
    required: false,
    description: 'Condição do resíduo',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limite de registros por página',
  })
  @ApiResponse({ status: 200, description: 'Lista de resíduos disponíveis' })
  async getAvailable(
    @Query('wasteType') wasteType?: string,
    @Query('location') location?: string,
    @Query('condition') condition?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      ...(wasteType && { wasteType }),
      ...(location && { location }),
      ...(condition && { condition }),
    }

    const pagination = new PaginationRequest()
    pagination.page = page ? Number(page) : 1
    pagination.limit = limit ? Number(limit) : 10

    const result = await this.getAvailableWastesUseCase.execute({
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      pagination,
    })
    return result
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar resíduo por ID' })
  @ApiParam({ name: 'id', description: 'ID do resíduo' })
  @ApiResponse({ status: 200, description: 'Resíduo encontrado' })
  @ApiResponse({ status: 404, description: 'Resíduo não encontrado' })
  async getById(@Param('id') id: string) {
    const result = await this.getWasteByIdUseCase.execute(id)
    return result
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar resíduo' })
  @ApiParam({ name: 'id', description: 'ID do resíduo' })
  @ApiResponse({ status: 200, description: 'Resíduo atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Resíduo não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateWasteDto: UpdateWasteDto,
    @Request() req: any,
  ) {
    const result = await this.updateWasteUseCase.execute({
      wasteId: id,
      updateWasteDto,
      userId: req.user.id,
    })
    return result
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar resíduo' })
  @ApiParam({ name: 'id', description: 'ID do resíduo' })
  @ApiResponse({ status: 200, description: 'Resíduo deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Resíduo não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async delete(@Param('id') id: string, @Request() req: any) {
    const result = await this.deleteWasteUseCase.execute({
      wasteId: id,
      userId: req.user.id,
    })
    return result
  }
}
