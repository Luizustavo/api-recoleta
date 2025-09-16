import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignCollectionDto {
  @ApiProperty({
    description: 'ID do resíduo que deseja assinar para coleta',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  wasteId: string
}
