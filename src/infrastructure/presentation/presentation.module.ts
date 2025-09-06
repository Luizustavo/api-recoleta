import { Module } from '@nestjs/common'
import { PersistenceModule } from '../persistence/persistence.module'
import { AuthModule } from '../auth/auth.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from '../telemetry/winston.config'
import { UserController } from './controllers/user.controller'
import { AuthController } from './controllers/auth.controller'
import { CreateUserUseCase } from '@/application/user-cases/create-user.use-case'
import { GetAllUsersUseCase } from '@/application/user-cases/get-all-users.use-case'
import { GetUserByIdUseCase } from '@/application/user-cases/get-user-by-id.use-case'
import { UpdateUserUseCase } from '@/application/user-cases/update-user.use-case'
import { DeleteUserUseCase } from '@/application/user-cases/delete-user.use-case'
import { GrpcUserController } from './controllers/grpc-user.controller'

@Module({
  imports: [
    PersistenceModule,
    AuthModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [UserController, AuthController, GrpcUserController],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class PresentationModule {}
