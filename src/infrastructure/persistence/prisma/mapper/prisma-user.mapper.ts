import { UserEntity } from '@/domain/entities/user.entity'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {
  private constructor() {
    throw new Error(
      'PrismaUserMapper is a static class and should not be instantiated',
    )
  }

  public static toPrisma(entity: UserEntity): Prisma.UserCreateInput {
    const data: Prisma.UserCreateInput = {
      email: entity.email,
      name: entity.name,
      password: entity.password || '',
    }

    return data
  }

  public static toEntity(prisma: PrismaUser): UserEntity {
    const entity = new UserEntity(
      {
        name: prisma.name,
        email: prisma.email,
        password: prisma.password,
      },
      prisma.id,
    )

    return entity
  }
}
