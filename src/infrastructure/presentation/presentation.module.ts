import { Module } from '@nestjs/common'
import { PersistenceModule } from '../persistence/persistence.module'
import { AuthModule } from '../auth/auth.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from '../telemetry/winston.config'
import { UserController } from './controllers/user.controller'
import { AuthController } from './controllers/auth.controller'
import { AddressController } from './controllers/address.controller'
import { CreateUserUseCase } from '@/application/user-cases/create-user.use-case'
import { GetAllUsersUseCase } from '@/application/user-cases/get-all-users.use-case'
import { GetUserByIdUseCase } from '@/application/user-cases/get-user-by-id.use-case'
import { UpdateUserUseCase } from '@/application/user-cases/update-user.use-case'
import { DeleteUserUseCase } from '@/application/user-cases/delete-user.use-case'
import { CreateAddressUseCase } from '@/application/user-cases/create-address.use-case'
import { GetAllAddressesUseCase } from '@/application/user-cases/get-all-addresses.use-case'
import { GetAddressByIdUseCase } from '@/application/user-cases/get-address-by-id.use-case'
import { UpdateAddressUseCase } from '@/application/user-cases/update-address.use-case'
import { DeleteAddressUseCase } from '@/application/user-cases/delete-address.use-case'
import { LoginUseCase } from '@/application/user-cases/login.use-case'
import { ValidateTokenUseCase } from '@/application/user-cases/validate-token.use-case'

@Module({
  imports: [
    PersistenceModule,
    AuthModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [UserController, AuthController, AddressController],
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
  ],
})
export class PresentationModule {}
