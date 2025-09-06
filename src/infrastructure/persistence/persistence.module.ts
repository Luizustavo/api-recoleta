import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository'
import { PrismaAddressRepository } from './prisma/repositories/prisma-address.repository'
import { PrismaWasteRepository } from './prisma/repositories/prisma-waste.repository'
import { ADDRESS_REPOSITORY_TOKEN, WASTE_REPOSITORY_TOKEN } from './constants'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ADDRESS_REPOSITORY_TOKEN,
      useClass: PrismaAddressRepository,
    },
    {
      provide: WASTE_REPOSITORY_TOKEN,
      useClass: PrismaWasteRepository,
    },
  ],
  exports: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: ADDRESS_REPOSITORY_TOKEN,
      useClass: PrismaAddressRepository,
    },
    {
      provide: WASTE_REPOSITORY_TOKEN,
      useClass: PrismaWasteRepository,
    },
  ],
})
export class PersistenceModule {}
