import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository'
import { PrismaAddressRepository } from './prisma/repositories/prisma-address.repository'
import { PrismaWasteRepository } from './prisma/repositories/prisma-waste.repository'
import { PrismaCollectionRepository } from './prisma/repositories/prisma-collection.repository'
import {
  ADDRESS_REPOSITORY_TOKEN,
  WASTE_REPOSITORY_TOKEN,
  COLLECTION_REPOSITORY_TOKEN,
} from './constants'

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
    {
      provide: COLLECTION_REPOSITORY_TOKEN,
      useClass: PrismaCollectionRepository,
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
    {
      provide: COLLECTION_REPOSITORY_TOKEN,
      useClass: PrismaCollectionRepository,
    },
  ],
})
export class PersistenceModule {}
