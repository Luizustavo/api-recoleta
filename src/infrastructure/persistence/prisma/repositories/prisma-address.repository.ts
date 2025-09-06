import { Injectable } from '@nestjs/common'
import { AddressRepositoryInterface } from '../../../../domain/repositories/address-repository.interface'
import { AddressEntity } from '../../../../domain/entities/address.entity'
import { PrismaService } from '../prisma.service'
import { PrismaAddressMapper } from '../mapper/prisma-address.mapper'

@Injectable()
export class PrismaAddressRepository implements AddressRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(address: AddressEntity): Promise<AddressEntity> {
    const addressData = PrismaAddressMapper.toPrisma(address)
    const createdAddress = await this.prismaService.address.create({
      data: addressData,
    })
    return PrismaAddressMapper.toDomain(createdAddress)
  }

  async findAllByUserId(userId: string): Promise<AddressEntity[]> {
    const addresses = await this.prismaService.address.findMany({
      where: { userId },
    })
    return PrismaAddressMapper.toDomainList(addresses)
  }

  async findById(id: string): Promise<AddressEntity | null> {
    const address = await this.prismaService.address.findUnique({
      where: { id },
    })
    if (!address) {
      return null
    }
    return PrismaAddressMapper.toDomain(address)
  }

  async update(
    id: string,
    addressData: Partial<AddressEntity>,
  ): Promise<AddressEntity> {
    const updatedAddress = await this.prismaService.address.update({
      where: { id },
      data: {
        ...addressData,
        updatedAt: new Date(),
      },
    })
    return PrismaAddressMapper.toDomain(updatedAddress)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.address.delete({
      where: { id },
    })
  }
}
