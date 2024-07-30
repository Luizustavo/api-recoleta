import { ReturnBaseDTO } from '@/application/dtos/base/return-base.dto'
import { IException } from '@/domain/base/exception.interface'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const statusCode = exception.getStatus()
    const message = exception.message || null

    const body: ReturnBaseDTO<unknown> = {
      success: false,
      message: exception.message,
      data: undefined,
    }

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as { message: string[] }
      body.data = exceptionResponse.message
      body.message = exception.message
    } else if (exception instanceof IException) {
      body.code = exception.details.code as string
    }

    this.logger.error({ message: `${statusCode} ${message}`, data: body })

    response.status(statusCode).json(body)
  }
}
