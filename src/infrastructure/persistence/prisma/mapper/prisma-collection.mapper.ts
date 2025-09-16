import {
  Collection as PrismaCollection,
  User as PrismaUser,
  Waste as PrismaWaste,
  Address as PrismaAddress,
} from '@prisma/client'

import { CollectionEntity } from '../../../../domain/entities/collection.entity'
import { UserEntity } from '../../../../domain/entities/user.entity'
import { WasteEntity } from '../../../../domain/entities/waste.entity'
import { AddressEntity } from '../../../../domain/entities/address.entity'

type PrismaCollectionWithRelations = PrismaCollection & {
  collector?: PrismaUser
  waste?: PrismaWaste & {
    user?: PrismaUser
    address?: PrismaAddress
  }
}

export class PrismaCollectionMapper {
  private constructor() {}

  public static toDomain(
    prismaCollection: PrismaCollectionWithRelations,
  ): CollectionEntity {
    let collector: UserEntity | undefined
    let waste: WasteEntity | undefined

    // Mapear coletor se presente
    if (prismaCollection.collector) {
      collector = new UserEntity(
        {
          name: prismaCollection.collector.name || '',
          email: prismaCollection.collector.email,
        },
        prismaCollection.collector.id,
      )
    }

    // Mapear resíduo se presente
    if (prismaCollection.waste) {
      let wasteUser: UserEntity | undefined
      let wasteAddress: AddressEntity | undefined

      // Mapear usuário do resíduo se presente
      if (prismaCollection.waste.user) {
        wasteUser = new UserEntity(
          {
            name: prismaCollection.waste.user.name || '',
            email: prismaCollection.waste.user.email,
          },
          prismaCollection.waste.user.id,
        )
      }

      // Mapear endereço do resíduo se presente
      if (prismaCollection.waste.address) {
        wasteAddress = new AddressEntity(
          {
            street: prismaCollection.waste.address.street,
            number: prismaCollection.waste.address.number,
            city: prismaCollection.waste.address.city,
            state: prismaCollection.waste.address.state,
            country: prismaCollection.waste.address.country,
            zipCode: prismaCollection.waste.address.zipCode,
            longitude: prismaCollection.waste.address.longitude,
            latitude: prismaCollection.waste.address.latitude,
            userId: prismaCollection.waste.address.userId,
            createdAt: prismaCollection.waste.address.createdAt,
            updatedAt: prismaCollection.waste.address.updatedAt,
          },
          prismaCollection.waste.address.id,
        )
      }

      waste = new WasteEntity(
        {
          wasteType: prismaCollection.waste.wasteType,
          weight: prismaCollection.waste.weight,
          quantity: prismaCollection.waste.quantity,
          unit: prismaCollection.waste.unit,
          condition: prismaCollection.waste.condition,
          hasPackaging: prismaCollection.waste.hasPackaging,
          discardDate: prismaCollection.waste.discardDate,
          additionalDescription: prismaCollection.waste.additionalDescription,
          images: prismaCollection.waste.images,
          status: prismaCollection.waste.status,
          userId: prismaCollection.waste.userId,
          addressId: prismaCollection.waste.addressId,
          user: wasteUser,
          address: wasteAddress,
          createdAt: prismaCollection.waste.createdAt,
          updatedAt: prismaCollection.waste.updatedAt,
        },
        prismaCollection.waste.id,
      )
    }

    const collectionEntity = new CollectionEntity(
      {
        collectorId: prismaCollection.collectorId,
        wasteId: prismaCollection.wasteId,
        status: prismaCollection.status,
        signedAt: prismaCollection.signedAt,
        collectedAt: prismaCollection.collectedAt || undefined,
        collector,
        waste,
        createdAt: prismaCollection.createdAt,
        updatedAt: prismaCollection.updatedAt,
      },
      prismaCollection.id,
    )

    return collectionEntity
  }

  public static toPrisma(collectionEntity: CollectionEntity): any {
    return {
      id: collectionEntity.id,
      collectorId: collectionEntity.collectorId,
      wasteId: collectionEntity.wasteId,
      status: collectionEntity.status,
      signedAt: collectionEntity.signedAt,
      collectedAt: collectionEntity.collectedAt,
      createdAt: collectionEntity.createdAt,
      updatedAt: collectionEntity.updatedAt,
    }
  }
}
