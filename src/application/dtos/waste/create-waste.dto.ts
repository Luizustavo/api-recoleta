import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsCoordinate } from '../../validators/coordinate.validator'

export enum WasteTypeEnum {
  ELECTRONICS = 'ELECTRONICS',
  ORGANIC = 'ORGANIC',
  PLASTIC = 'PLASTIC',
  PAPER = 'PAPER',
  GLASS = 'GLASS',
  METAL = 'METAL',
  WOOD = 'WOOD',
  TEXTILE = 'TEXTILE',
  MISCELLANEOUS = 'MISCELLANEOUS',
}

export enum UnitTypeEnum {
  KG = 'KG',
  LITERS = 'LITERS',
  UNITS = 'UNITS',
}

export enum ConditionTypeEnum {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED',
}

export class WasteDataDto {
  @ApiProperty({
    description: 'Tipo de resíduo',
    enum: WasteTypeEnum,
    example: WasteTypeEnum.ELECTRONICS,
  })
  @IsEnum(WasteTypeEnum)
  wasteType: string

  @ApiProperty({
    description: 'Peso do resíduo',
    example: 2.5,
  })
  @IsNumber()
  weight: number

  @ApiProperty({
    description: 'Quantidade de itens',
    example: 1,
  })
  @IsNumber()
  quantity: number

  @ApiProperty({
    description: 'Unidade de medida',
    enum: UnitTypeEnum,
    example: UnitTypeEnum.KG,
  })
  @IsEnum(UnitTypeEnum)
  unit: string

  @ApiProperty({
    description: 'Condição do resíduo',
    enum: ConditionTypeEnum,
    example: ConditionTypeEnum.USED,
  })
  @IsEnum(ConditionTypeEnum)
  condition: string

  @ApiProperty({
    description: 'Se possui embalagem',
    example: true,
  })
  @IsBoolean()
  hasPackaging: boolean

  @ApiProperty({
    description: 'Data de descarte',
    example: '2025-09-10T10:00:00.000Z',
  })
  @IsDateString()
  discardDate: string

  @ApiPropertyOptional({
    description: 'Descrição adicional do resíduo',
    example: 'Smartphone antigo em bom estado, apenas a tela está trincada',
  })
  @IsString()
  @IsOptional()
  additionalDescription?: string

  @ApiPropertyOptional({
    description: 'URLs das imagens do resíduo',
    example: [
      'https://exemplo.com/imagem1.jpg',
      'https://exemplo.com/imagem2.jpg',
    ],
  })
  @IsArray()
  @IsOptional()
  images?: string[]
}

export class AddressDataDto {
  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  @IsString()
  street: string

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  @IsString()
  number: string

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Apartamento 45',
  })
  @IsString()
  @IsOptional()
  complement?: string

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString()
  neighborhood: string

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString()
  city: string

  @ApiProperty({
    description: 'Estado (sigla)',
    example: 'SP',
  })
  @IsString()
  state: string

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
  })
  @IsString()
  zipCode: string

  @ApiPropertyOptional({
    description: 'Ponto de referência',
    example: 'Próximo ao shopping center',
  })
  @IsString()
  @IsOptional()
  reference?: string

  @ApiPropertyOptional({
    description: 'Se é o endereço principal',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  main?: boolean

  @ApiProperty({
    description:
      'Latitude do endereço (obrigatório para cálculo de proximidade)',
    example: '-23.5505',
    type: 'string',
  })
  @IsString()
  @IsCoordinate('latitude')
  latitude: string

  @ApiProperty({
    description:
      'Longitude do endereço (obrigatório para cálculo de proximidade)',
    example: '-46.6333',
    type: 'string',
  })
  @IsString()
  @IsCoordinate('longitude')
  longitude: string
}

export class CreateWasteDto {
  @ApiProperty({
    description: 'Dados do resíduo',
    type: WasteDataDto,
  })
  waste: WasteDataDto

  @ApiProperty({
    description: 'Dados do endereço de coleta',
    type: AddressDataDto,
  })
  address: AddressDataDto
}
