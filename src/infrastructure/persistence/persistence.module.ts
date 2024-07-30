import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class PersistenceModule {}
