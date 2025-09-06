import { Waste as PrismaWaste } from '@prisma/client'

import { WasteEntity } from '../../../../domain/entities/waste.entity'

export class PrismaWasteMapper {
  private constructor() {}

  public static toDomain(prismaWaste: PrismaWaste): WasteEntity {
    const wasteEntity = new WasteEntity(
      {
        wasteType: prismaWaste.wasteType,
        weight: prismaWaste.weight,
        quantity: prismaWaste.quantity,
        unit: prismaWaste.unit,
        condition: prismaWaste.condition,
        hasPackaging: prismaWaste.hasPackaging,
        discardDate: prismaWaste.discardDate,
        additionalDescription: prismaWaste.additionalDescription,
        images: prismaWaste.images,
        status: prismaWaste.status,
        userId: prismaWaste.userId,
        addressId: prismaWaste.addressId,
        createdAt: prismaWaste.createdAt,
        updatedAt: prismaWaste.updatedAt,
      },
      prismaWaste.id,
    )

    return wasteEntity
  }

  public static toPrisma(wasteEntity: WasteEntity): any {
    return {
      id: wasteEntity.id,
      wasteType: wasteEntity.wasteType,
      weight: wasteEntity.weight,
      quantity: wasteEntity.quantity,
      unit: wasteEntity.unit,
      condition: wasteEntity.condition,
      hasPackaging: wasteEntity.hasPackaging,
      discardDate: wasteEntity.discardDate,
      additionalDescription: wasteEntity.additionalDescription,
      images: wasteEntity.images,
      status: wasteEntity.status,
      userId: wasteEntity.userId,
      addressId: wasteEntity.addressId,
      createdAt: wasteEntity.createdAt,
      updatedAt: wasteEntity.updatedAt,
    }
  }
}
