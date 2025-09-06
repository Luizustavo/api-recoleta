import { UseCase } from '../use-case.interface'
import { Injectable, Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { JwtService } from '@nestjs/jwt'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { ValidateTokenResponseDto } from '../../dtos/auth/auth-response.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'

@Injectable()
export class ValidateTokenUseCase
  implements UseCase<string, ReturnBaseDTO<ValidateTokenResponseDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    token: string,
  ): Promise<ReturnBaseDTO<ValidateTokenResponseDto>> {
    this.logger.info('[Auth] ValidateTokenUseCase.execute - token', {
      hasToken: !!token,
    })
    const vm = new ReturnBaseDTO<ValidateTokenResponseDto>()
    try {
      if (!token) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'Token not provided'
        vm.success = false
        vm.data = { valid: false }
        this.logger.warn('[Auth] ValidateTokenUseCase.noToken')
        return vm
      }

      const payload = await this.jwtService.verifyAsync(token)
      vm.code = ReturnCodeEnum.Success
      vm.message = 'Token validated successfully'
      vm.success = true
      vm.data = { valid: true, payload }
      this.logger.info('[Auth] ValidateTokenUseCase.success', {
        userId: payload.id,
      })
    } catch (error) {
      this.logger.warn('[Auth] ValidateTokenUseCase.invalidToken', { error })
      vm.code = ReturnCodeEnum.NotFound
      vm.message = 'Invalid token'
      vm.success = false
      vm.data = { valid: false }
    }
    return vm
  }
}
