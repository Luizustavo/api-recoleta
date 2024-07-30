import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Response } from 'express'

@Catch()
export class GenericExceptionFilter extends BaseExceptionFilter {
  logger = new Logger('GenericExceptionFilter')

  catch(_exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = HttpStatus.INTERNAL_SERVER_ERROR

    this.logger.error(_exception)

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      message: 'Internal server error',
      code: ReturnCodeEnum.InternalError,
    })
  }
}
