import { ApiProperty } from '@nestjs/swagger'

export class PaginationResponse<T = any> {
  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  totalPages: number

  @ApiProperty()
  totalItems: number

  @ApiProperty({ isArray: true })
  items: T[]
}
