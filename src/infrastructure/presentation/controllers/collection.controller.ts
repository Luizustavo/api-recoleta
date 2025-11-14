import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { SignCollectionDto } from '../../../application/dtos/collection/sign-collection.dto'
import { PaginationRequest } from '../../../application/dtos/base/pagination-request.dto'

import { SignCollectionUseCase } from '../../../application/use-cases/collection/sign-collection.use-case'
import { GetUserCollectionsUseCase } from '../../../application/use-cases/collection/get-user-collections.use-case'

@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(
    private readonly signCollectionUseCase: SignCollectionUseCase,
    private readonly getUserCollectionsUseCase: GetUserCollectionsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assinar para coletar um resíduo' })
  @ApiResponse({ status: 201, description: 'Coleta assinada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Resíduo não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Resíduo não disponível ou já assinado pelo usuário',
  })
  async signCollection(
    @Body() signCollectionDto: SignCollectionDto,
    @Request() req: any,
  ) {
    const userId = req.user.id
    return this.signCollectionUseCase.execute({
      signCollectionDto,
      userId,
    })
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar minhas coletas assinadas' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status da coleta',
    enum: ['SIGNED', 'COLLECTED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limite de registros por página',
  })
  @ApiResponse({ status: 200, description: 'Lista de coletas do usuário' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getMyCollections(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.id
    const pagination = new PaginationRequest()
    pagination.page = page ? Number.parseInt(page, 10) : 1
    pagination.limit = limit ? Number.parseInt(limit, 10) : 10

    return this.getUserCollectionsUseCase.execute({
      userId,
      status,
      pagination,
    })
  }
}
