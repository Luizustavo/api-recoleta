import { IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsCoordinate } from '../../validators/coordinate.validator'

export class CreateAddressDto {
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

  @ApiProperty({
    description: 'Nome da cidade',
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

  @ApiPropertyOptional({
    description: 'País',
    example: 'Brasil',
    default: 'Brasil',
  })
  @IsString()
  @IsOptional()
  country?: string = 'Brasil'

  @ApiProperty({
    description: 'CEP',
    example: '01234-567',
  })
  @IsString()
  zipCode: string

  @ApiProperty({
    description: 'Longitude do endereço (obrigatório para geolocalização)',
    example: '-46.6333',
    type: 'string',
  })
  @IsString()
  @IsCoordinate('longitude')
  longitude: string

  @ApiProperty({
    description: 'Latitude do endereço (obrigatório para geolocalização)',
    example: '-23.5505',
    type: 'string',
  })
  @IsString()
  @IsCoordinate('latitude')
  latitude: string
}
