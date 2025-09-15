import { Module } from '@nestjs/common'
import { PersistenceModule } from '../persistence/persistence.module'
import { AuthModule } from '../auth/auth.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from '../telemetry/winston.config'
import { UserController } from './controllers/user.controller'
import { AuthController } from './controllers/auth.controller'
import { AddressController } from './controllers/address.controller'
import { WasteController } from './controllers/waste.controller'
import { CollectionController } from './controllers/collection.controller'
import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case'
import { GetAllUsersUseCase } from '@/application/use-cases/user/get-all-users.use-case'
import { GetUserByIdUseCase } from '@/application/use-cases/user/get-user-by-id.use-case'
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case'
import { DeleteUserUseCase } from '@/application/use-cases/user/delete-user.use-case'
import { CreateAddressUseCase } from '@/application/use-cases/address/create-address.use-case'
import { GetAllAddressesUseCase } from '@/application/use-cases/address/get-all-addresses.use-case'
import { GetAddressByIdUseCase } from '@/application/use-cases/address/get-address-by-id.use-case'
import { UpdateAddressUseCase } from '@/application/use-cases/address/update-address.use-case'
import { DeleteAddressUseCase } from '@/application/use-cases/address/delete-address.use-case'
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { ValidateTokenUseCase } from '@/application/use-cases/auth/validate-token.use-case'
import { CreateWasteUseCase } from '@/application/use-cases/waste/create-waste.use-case'
import { GetWasteByIdUseCase } from '@/application/use-cases/waste/get-waste-by-id.use-case'
import { GetAvailableWastesUseCase } from '@/application/use-cases/waste/get-available-wastes.use-case'
import { GetUserWastesUseCase } from '@/application/use-cases/waste/get-user-wastes.use-case'
import { UpdateWasteUseCase } from '@/application/use-cases/waste/update-waste.use-case'
import { DeleteWasteUseCase } from '@/application/use-cases/waste/delete-waste.use-case'
import { SignCollectionUseCase } from '@/application/use-cases/collection/sign-collection.use-case'
import { GetUserCollectionsUseCase } from '@/application/use-cases/collection/get-user-collections.use-case'

@Module({
  imports: [
    PersistenceModule,
    AuthModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [
    UserController,
    AuthController,
    AddressController,
    WasteController,
    CollectionController,
  ],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateAddressUseCase,
    GetAllAddressesUseCase,
    GetAddressByIdUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    LoginUseCase,
    ValidateTokenUseCase,
    CreateWasteUseCase,
    GetWasteByIdUseCase,
    GetAvailableWastesUseCase,
    GetUserWastesUseCase,
    UpdateWasteUseCase,
    DeleteWasteUseCase,
    SignCollectionUseCase,
    GetUserCollectionsUseCase,
  ],
})
export class PresentationModule {}
