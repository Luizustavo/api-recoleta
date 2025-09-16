import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export enum CollectionStatusEnum {
  SIGNED = 'SIGNED',
  COLLECTED = 'COLLECTED',
  CANCELLED = 'CANCELLED',
}

export class UpdateCollectionStatusDto {
  @ApiPropertyOptional({
    description: 'Novo status da coleta',
    enum: CollectionStatusEnum,
    example: CollectionStatusEnum.COLLECTED,
  })
  @IsEnum(CollectionStatusEnum)
  @IsOptional()
  status?: CollectionStatusEnum
}
