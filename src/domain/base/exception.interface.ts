import { RpcException } from '@nestjs/microservices'

export abstract class IException extends RpcException {
  abstract details?: Record<string, unknown>
}
