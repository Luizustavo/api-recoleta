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
}
