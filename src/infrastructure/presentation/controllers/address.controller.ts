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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CreateAddressDto } from '../../../application/dtos/address/create-address.dto'
import { UpdateAddressDto } from '../../../application/dtos/address/update-address.dto'
import { CreateAddressUseCase } from '../../../application/use-cases/address/create-address.use-case'
import { GetAllAddressesUseCase } from '../../../application/use-cases/address/get-all-addresses.use-case'
import { GetAddressByIdUseCase } from '../../../application/use-cases/address/get-address-by-id.use-case'
import { UpdateAddressUseCase } from '../../../application/use-cases/address/update-address.use-case'
import { DeleteAddressUseCase } from '../../../application/use-cases/address/delete-address.use-case'

@Controller('address')
@UseGuards(JwtAuthGuard)
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
  async findAll(@Request() req: any) {
    const userId = req.user.id
    const result = await this.getAllAddressesUseCase.execute(userId)
    return result
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.getAddressByIdUseCase.execute(id)
    return result
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string) {
    const result = await this.deleteAddressUseCase.execute(id)
    return result
  }
}
