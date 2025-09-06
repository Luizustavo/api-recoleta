import { Address } from '@prisma/client'
import { AddressEntity } from '../../../../domain/entities/address.entity'

export class PrismaAddressMapper {
  static toDomain(prismaAddress: Address): AddressEntity {
    return new AddressEntity(
      {
        street: prismaAddress.street,
        number: prismaAddress.number,
        city: prismaAddress.city,
        state: prismaAddress.state,
        country: prismaAddress.country,
        zipCode: prismaAddress.zipCode,
        longitude: prismaAddress.longitude || undefined,
        latitude: prismaAddress.latitude || undefined,
        userId: prismaAddress.userId,
        createdAt: prismaAddress.createdAt,
        updatedAt: prismaAddress.updatedAt,
      },
      prismaAddress.id,
    )
  }

  static toPrisma(addressEntity: AddressEntity): Omit<Address, 'id'> {
    return {
      street: addressEntity.street,
      number: addressEntity.number,
      city: addressEntity.city,
      state: addressEntity.state,
      country: addressEntity.country,
      zipCode: addressEntity.zipCode,
      longitude: addressEntity.longitude || null,
      latitude: addressEntity.latitude || null,
      userId: addressEntity.userId,
      createdAt: addressEntity.createdAt,
      updatedAt: addressEntity.updatedAt,
    }
  }

  static toDomainList(prismaAddresses: Address[]): AddressEntity[] {
    return prismaAddresses.map((address) => this.toDomain(address))
  }
}
