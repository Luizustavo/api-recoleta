import { IsString, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsCoordinate } from '../../validators/coordinate.validator'

export class UpdateAddressDto {
  @ApiPropertyOptional({
    description: 'Nome da rua',
    example: 'Rua das Rosas',
  })
  @IsString()
  @IsOptional()
  street?: string

  @ApiPropertyOptional({
    description: 'Número do endereço',
    example: '456',
  })
  @IsString()
  @IsOptional()
  number?: string

  @ApiPropertyOptional({
    description: 'Nome da cidade',
    example: 'Rio de Janeiro',
  })
  @IsString()
  @IsOptional()
  city?: string

  @ApiPropertyOptional({
    description: 'Estado (sigla)',
    example: 'RJ',
  })
  @IsString()
  @IsOptional()
  state?: string

  @ApiPropertyOptional({
    description: 'País',
    example: 'Brasil',
  })
  @IsString()
  @IsOptional()
  country?: string

  @ApiPropertyOptional({
    description: 'CEP',
    example: '22070-900',
  })
  @IsString()
  @IsOptional()
  zipCode?: string

  @ApiPropertyOptional({
    description: 'Longitude para geolocalização',
    example: '-43.17728',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  @IsCoordinate('longitude')
  longitude?: string

  @ApiPropertyOptional({
    description: 'Latitude para geolocalização',
    example: '-22.9668',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  @IsCoordinate('latitude')
  latitude?: string
}
