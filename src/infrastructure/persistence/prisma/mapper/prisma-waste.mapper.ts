import {
  Waste as PrismaWaste,
  User as PrismaUser,
  Address as PrismaAddress,
} from '@prisma/client'

import { WasteEntity } from '../../../../domain/entities/waste.entity'
import { UserEntity } from '../../../../domain/entities/user.entity'
import { AddressEntity } from '../../../../domain/entities/address.entity'

type PrismaWasteWithRelations = PrismaWaste & {
  user?: PrismaUser
  address?: PrismaAddress
}

export class PrismaWasteMapper {
  private constructor() {}

  public static toDomain(prismaWaste: PrismaWasteWithRelations): WasteEntity {
    let user: UserEntity | undefined
    let address: AddressEntity | undefined

    // Mapear usuário se presente
    if (prismaWaste.user) {
      user = new UserEntity(
        {
          name: prismaWaste.user.name || '',
          email: prismaWaste.user.email,
        },
        prismaWaste.user.id,
      )
    }

    // Mapear endereço se presente
    if (prismaWaste.address) {
      address = new AddressEntity(
        {
          street: prismaWaste.address.street,
          number: prismaWaste.address.number,
          city: prismaWaste.address.city,
          state: prismaWaste.address.state,
          country: prismaWaste.address.country,
          zipCode: prismaWaste.address.zipCode,
          longitude: prismaWaste.address.longitude,
          latitude: prismaWaste.address.latitude,
          userId: prismaWaste.address.userId,
          createdAt: prismaWaste.address.createdAt,
          updatedAt: prismaWaste.address.updatedAt,
        },
        prismaWaste.address.id,
      )
    }

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
        user,
        address,
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
