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
  wasteType: string

  @IsNumber()
  weight: number

  @IsNumber()
  quantity: number

  @IsEnum(UnitTypeEnum)
  unit: string

  @IsEnum(ConditionTypeEnum)
  condition: string

  @IsBoolean()
  hasPackaging: boolean

  @IsDateString()
  discardDate: string

  @IsString()
  @IsOptional()
  additionalDescription?: string

  @IsArray()
  @IsOptional()
  images?: string[]
}

export class AddressDataDto {
  @IsString()
  street: string

  @IsString()
  number: string

  @IsString()
  @IsOptional()
  complement?: string

  @IsString()
  neighborhood: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  zipCode: string

  @IsString()
  @IsOptional()
  reference?: string

  @IsBoolean()
  @IsOptional()
  main?: boolean
}

export class CreateWasteDto {
  waste: WasteDataDto
  address: AddressDataDto
}
