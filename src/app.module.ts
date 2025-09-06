import { Module } from '@nestjs/common'
import { PersistenceModule } from './infrastructure/persistence/persistence.module'
import { TelemetryModule } from './infrastructure/telemetry/telemetry.module'
import { PresentationModule } from './infrastructure/presentation/presentation.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelemetryModule,
    PersistenceModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
