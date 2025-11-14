import { IsNumber, IsOptional, Max, Min } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class PaginationRequest {
  @ApiPropertyOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10
}
