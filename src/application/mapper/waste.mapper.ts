import { WasteEntity } from '../../domain/entities/waste.entity'
import { WasteDto } from '../dtos/waste/waste.dto'

export class WasteMapper {
  private constructor() {}

  public static toDto(waste: WasteEntity): WasteDto {
    const dto = new WasteDto()

    dto.id = waste.id
    dto.wasteType = waste.wasteType
    dto.weight = waste.weight
    dto.quantity = waste.quantity
    dto.unit = waste.unit
    dto.condition = waste.condition
    dto.hasPackaging = waste.hasPackaging
    dto.discardDate = waste.discardDate.toISOString()
    dto.status = waste.status
    dto.additionalDescription = waste.additionalDescription
    dto.images = waste.images
    dto.userId = waste.userId
    dto.addressId = waste.addressId
    dto.createdAt = waste.createdAt
    dto.updatedAt = waste.updatedAt

    return dto
  }

  public static toEntity(dto: Partial<WasteDto>): WasteEntity {
    const discardDateTime = new Date(dto.discardDate!)

    return new WasteEntity(
      {
        wasteType: dto.wasteType!,
        weight: dto.weight!,
        quantity: dto.quantity!,
        unit: dto.unit!,
        condition: dto.condition!,
        hasPackaging: dto.hasPackaging!,
        discardDate: discardDateTime,
        additionalDescription: dto.additionalDescription,
        images: dto.images,
        status: dto.status,
        userId: dto.userId!,
        addressId: dto.addressId!,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      },
      dto.id,
    )
  }
}
