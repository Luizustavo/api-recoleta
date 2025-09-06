import { IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { WasteDataDto } from './create-waste.dto'

export class UpdateWasteDto {
  @ApiPropertyOptional({
    description: 'Dados do resíduo para atualização (campos opcionais)',
    type: 'object',
    example: {
      wasteType: 'ELECTRONICS',
      weight: 3.2,
      quantity: 1,
      unit: 'KG',
      condition: 'USED',
      hasPackaging: false,
      discardDate: '2025-09-15T14:30:00.000Z',
      additionalDescription: 'Notebook antigo funcionando perfeitamente',
      images: ['https://exemplo.com/notebook1.jpg'],
    },
  })
  @IsOptional()
  waste?: Partial<WasteDataDto>
}
