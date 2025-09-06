import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Span } from '@/infrastructure/telemetry/span.config'
import { UserEntity } from '@/domain/entities/user.entity'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { PrismaUserMapper } from '../mapper/prisma-user.mapper'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  @Span('PrismaUserRepository.saveAsync')
  async saveAsync(entity: UserEntity): Promise<void> {
    const data = PrismaUserMapper.toPrisma(entity)
    await this.prisma.user.create({ data })
  }
  @Span('PrismaUserRepository.findAsync')
  async findAsync(email: string): Promise<UserEntity> {
    const prisma = await this.prisma.user.findUnique({ where: { email } })
    if (!prisma) {
      return null
    }
    return PrismaUserMapper.toEntity(prisma)
  }

  @Span('PrismaUserRepository.findByIdAsync')
  async findByIdAsync(id: string): Promise<UserEntity | null> {
    const prisma = await this.prisma.user.findUnique({ where: { id } })
    if (!prisma) return null
    return PrismaUserMapper.toEntity(prisma)
  }

  @Span('PrismaUserRepository.findAllAsync')
  async findAllAsync(skip?: number, take?: number): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({ skip, take })
    return users.map(PrismaUserMapper.toEntity)
  }

  @Span('PrismaUserRepository.updateAsync')
  async updateAsync(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    // Supondo que data pode conter name/email
    const updateData: Partial<{ name: string; email: string }> = {}
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    const prisma = await this.prisma.user.update({
      where: { id },
      data: updateData,
    })
    return PrismaUserMapper.toEntity(prisma)
  }

  @Span('PrismaUserRepository.deleteAsync')
  async deleteAsync(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  }
}
