import { IsEmail, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome do usuário',
    example: 'João Silva Santos',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'joao.santos@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string
}
