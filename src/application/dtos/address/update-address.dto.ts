import { IsString, IsOptional, IsNumber } from 'class-validator'

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  street?: string

  @IsString()
  @IsOptional()
  number?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsString()
  @IsOptional()
  state?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsString()
  @IsOptional()
  zipCode?: string

  @IsNumber()
  @IsOptional()
  longitude?: number

  @IsNumber()
  @IsOptional()
  latitude?: number
}
