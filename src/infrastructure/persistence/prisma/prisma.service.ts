import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaClient, Prisma } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    })
  }

  async onModuleInit() {
    this.$on('error', (event) => {
      this.logger.error({
        message: event.message,
        meta: {
          ...event,
        },
      })
    })
    this.$on('warn', (event) => {
      this.logger.warn({
        message: event.message,
        meta: {
          ...event,
        },
      })
    })
    this.$on('info', (event) => {
      this.logger.verbose({
        message: event.message,
        meta: {
          ...event,
        },
      })
    })
    this.$on('query', (event) => {
      this.logger.debug({
        message: event.query,
        meta: {
          ...event,
        },
      })
    })
    await this.$connect()
  }
}
