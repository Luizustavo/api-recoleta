import { Injectable } from '@nestjs/common'

import { WasteEntity } from '../../../../domain/entities/waste.entity'
import { WasteRepositoryInterface } from '../../../../domain/repositories/waste-repository.interface'
import { PrismaService } from '../prisma.service'
import { PrismaWasteMapper } from '../mapper/prisma-waste.mapper'

@Injectable()
export class PrismaWasteRepository implements WasteRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(waste: WasteEntity): Promise<WasteEntity> {
    const wasteData = PrismaWasteMapper.toPrisma(waste)
    delete wasteData.id // Remove ID to let Prisma generate it

    const createdWaste = await this.prisma.waste.create({
      data: wasteData,
    })

    return PrismaWasteMapper.toDomain(createdWaste)
  }

  async findById(id: string): Promise<WasteEntity | null> {
    const waste = await this.prisma.waste.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
      },
    })

    if (!waste) {
      return null
    }

    return PrismaWasteMapper.toDomain(waste)
  }

  async findAllByUserId(userId: string): Promise<WasteEntity[]> {
    const wastes = await this.prisma.waste.findMany({
      where: { userId },
      include: {
        user: true,
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return wastes.map((waste) => PrismaWasteMapper.toDomain(waste))
  }

  async findAvailable(filters?: any): Promise<WasteEntity[]> {
    const where: any = {
      status: 'AVAILABLE',
    }

    if (filters) {
      if (filters.wasteType) {
        where.wasteType = filters.wasteType
      }
      if (filters.condition) {
        where.condition = filters.condition
      }
      if (filters.location) {
        where.address = {
          OR: [
            { city: { contains: filters.location, mode: 'insensitive' } },
            { state: { contains: filters.location, mode: 'insensitive' } },
          ],
        }
      }
    }

    const wastes = await this.prisma.waste.findMany({
      where,
      include: {
        user: true,
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return wastes.map((waste) => PrismaWasteMapper.toDomain(waste))
  }

  async update(id: string, data: any): Promise<WasteEntity> {
    const updateData = { ...data }
    delete updateData.id
    delete updateData.userId
    delete updateData.createdAt
    updateData.updatedAt = new Date()

    const updatedWaste = await this.prisma.waste.update({
      where: { id },
      data: updateData,
    })

    return PrismaWasteMapper.toDomain(updatedWaste)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.waste.delete({
      where: { id },
    })
  }
}
