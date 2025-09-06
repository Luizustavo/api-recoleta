import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string

  @IsEmail({}, { message: 'Email inválido' })
  email: string

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string
}
