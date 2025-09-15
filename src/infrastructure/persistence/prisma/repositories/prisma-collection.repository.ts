import { Injectable } from '@nestjs/common'

import { CollectionEntity } from '../../../../domain/entities/collection.entity'
import { CollectionRepositoryInterface } from '../../../../domain/repositories/collection-repository.interface'
import { PrismaService } from '../prisma.service'
import { PrismaCollectionMapper } from '../mapper/prisma-collection.mapper'

@Injectable()
export class PrismaCollectionRepository
  implements CollectionRepositoryInterface
{
  constructor(private readonly prisma: PrismaService) {}

  async create(collection: CollectionEntity): Promise<CollectionEntity> {
    const collectionData = PrismaCollectionMapper.toPrisma(collection)
    delete collectionData.id // Remove ID to let Prisma generate it

    const createdCollection = await this.prisma.collection.create({
      data: collectionData,
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
    })

    return PrismaCollectionMapper.toDomain(createdCollection)
  }

  async findById(id: string): Promise<CollectionEntity | null> {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
    })

    if (!collection) {
      return null
    }

    return PrismaCollectionMapper.toDomain(collection)
  }

  async findByWasteId(wasteId: string): Promise<CollectionEntity[]> {
    const collections = await this.prisma.collection.findMany({
      where: { wasteId },
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return collections.map((collection) =>
      PrismaCollectionMapper.toDomain(collection),
    )
  }

  async findByCollectorId(collectorId: string): Promise<CollectionEntity[]> {
    const collections = await this.prisma.collection.findMany({
      where: { collectorId },
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return collections.map((collection) =>
      PrismaCollectionMapper.toDomain(collection),
    )
  }

  async findByCollectorIdAndWasteId(
    collectorId: string,
    wasteId: string,
  ): Promise<CollectionEntity | null> {
    const collection = await this.prisma.collection.findUnique({
      where: {
        collectorId_wasteId: {
          collectorId,
          wasteId,
        },
      },
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
    })

    if (!collection) {
      return null
    }

    return PrismaCollectionMapper.toDomain(collection)
  }

  async findAllByCollectorId(
    collectorId: string,
    filters?: {
      status?: string
      page?: number
      limit?: number
    },
  ): Promise<CollectionEntity[]> {
    const where: any = {
      collectorId,
    }

    if (filters?.status) {
      where.status = filters.status
    }

    const skip =
      filters?.page && filters?.limit ? (filters.page - 1) * filters.limit : 0
    const take = filters?.limit || 10

    const collections = await this.prisma.collection.findMany({
      where,
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    })

    return collections.map((collection) =>
      PrismaCollectionMapper.toDomain(collection),
    )
  }

  async update(
    id: string,
    data: Partial<CollectionEntity>,
  ): Promise<CollectionEntity> {
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Only update fields that are allowed to be updated
    if (data.status) updateData.status = data.status
    if (data.collectedAt) updateData.collectedAt = data.collectedAt

    const updatedCollection = await this.prisma.collection.update({
      where: { id },
      data: updateData,
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
    })

    return PrismaCollectionMapper.toDomain(updatedCollection)
  }

  async updateStatus(
    id: string,
    status: string,
    collectedAt?: Date,
  ): Promise<CollectionEntity> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (collectedAt) {
      updateData.collectedAt = collectedAt
    }

    const updatedCollection = await this.prisma.collection.update({
      where: { id },
      data: updateData,
      include: {
        collector: true,
        waste: {
          include: {
            user: true,
            address: true,
          },
        },
      },
    })

    return PrismaCollectionMapper.toDomain(updatedCollection)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.collection.delete({
      where: { id },
    })
  }
}
