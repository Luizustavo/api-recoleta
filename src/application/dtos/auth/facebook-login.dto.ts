import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class FacebookLoginDto {
  @ApiProperty({
    description: 'Access token fornecido pelo Facebook após o login',
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string
}
