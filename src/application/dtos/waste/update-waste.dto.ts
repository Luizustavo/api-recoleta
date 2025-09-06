import { IsOptional } from 'class-validator'

import { WasteDataDto } from './create-waste.dto'

export class UpdateWasteDto {
  @IsOptional()
  waste?: Partial<WasteDataDto>
}
