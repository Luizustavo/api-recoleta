import { IsString, IsOptional, IsNumber } from 'class-validator'

export class CreateAddressDto {
  @IsString()
  street: string

  @IsString()
  number: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  @IsOptional()
  country?: string = 'Brasil'

  @IsString()
  zipCode: string

  @IsNumber()
  @IsOptional()
  longitude?: number

  @IsNumber()
  @IsOptional()
  latitude?: number
}
