import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator'

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
  @IsEnum(WasteTypeEnum)
  tipoResiduo: string

  @IsNumber()
  peso: number

  @IsNumber()
  quantidade: number

  @IsEnum(UnitTypeEnum)
  unidade: string

  @IsEnum(ConditionTypeEnum)
  condicao: string

  @IsString()
  @IsEnum(['sim', 'não'])
  embalagem: string

  @IsDateString()
  dataDescarte: string

  @IsString()
  horaDescarte: string

  @IsString()
  @IsOptional()
  descricaoAdicional?: string

  @IsArray()
  @IsOptional()
  imagens?: string[]
}

export class AddressDataDto {
  @IsString()
  rua: string

  @IsString()
  numero: string

  @IsString()
  @IsOptional()
  complemento?: string

  @IsString()
  bairro: string

  @IsString()
  cidade: string

  @IsString()
  estado: string

  @IsString()
  cep: string

  @IsString()
  @IsOptional()
  referencia?: string

  @IsBoolean()
  @IsOptional()
  principal?: boolean
}

export class CreateWasteDto {
  waste: WasteDataDto
  address: AddressDataDto
}
