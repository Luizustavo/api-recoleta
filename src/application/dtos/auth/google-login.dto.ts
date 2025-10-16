import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GoogleLoginDto {
  @ApiProperty({
    description: 'ID token JWT fornecido pelo Google após o login',
  })
  @IsNotEmpty()
  @IsString()
  token: string
}
