import telemetry from './infrastructure/telemetry/telemetry.config'
telemetry()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from './infrastructure/telemetry/winston.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { GenericExceptionFilter } from './infrastructure/presentation/filters/generic-exceptions.filter'
import { HttpExceptionFilter } from './infrastructure/presentation/filters/http-exception.filter'
import { grpcClientOptions } from './infrastructure/presentation/grpc/grpc-client.options'
import { MicroserviceOptions } from '@nestjs/microservices'

const APP_ROUTE_PREFIX = 'api'

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig)
  const app = await NestFactory.create(AppModule, { cors: true, logger })

  app.enableCors({
    origin: ['http://localhost:3000'], // your Next.js frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  app.useGlobalFilters(new GenericExceptionFilter(), new HttpExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  app
    .enableVersioning({
      type: VersioningType.URI,
    })
    .setGlobalPrefix(APP_ROUTE_PREFIX)

  const config = new DocumentBuilder()
    .setTitle('API Recoleta')
    .setDescription('API para gestão de coleta e reciclagem de resíduos')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('user', 'Endpoints de usuários')
    .addTag('address', 'Endpoints de endereços')
    .addTag('waste', 'Endpoints de resíduos')
    .addTag('collection', 'Endpoints de coleta de resíduos')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(APP_ROUTE_PREFIX, app, document)

  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions)
  logger.debug(`GRPC server is listening`, grpcClientOptions.options)

  await app.listen(Number(process.env.HTTP_PORT) || 3004)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
