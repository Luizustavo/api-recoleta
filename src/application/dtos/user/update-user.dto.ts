import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string
}
