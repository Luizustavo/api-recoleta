import { Module } from '@nestjs/common'
import { PersistenceModule } from '../persistence/persistence.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from '../telemetry/winston.config'
import { UserController } from './controllers/user.controller'
import { CreateUserUseCase } from '@/application/user-cases/create-user.use-case'
import { GrpcUserController } from './controllers/grpc-user.controller'

@Module({
  imports: [PersistenceModule, WinstonModule.forRoot(winstonConfig)],
  controllers: [UserController, GrpcUserController],
  providers: [CreateUserUseCase],
})
export class PresentationModule {}
