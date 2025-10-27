import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthGuard } from '@/infrastructure/auth/guards/jwt-auth.guard'
import { AuthService } from '@/application/services/auth.service'
import { HttpModule } from '@nestjs/axios'
import { PersistenceModule } from '../persistence/persistence.module'

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PersistenceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [],
  exports: [JwtModule, JwtAuthGuard, HttpModule, AuthService],
})
export class AuthModule {}
