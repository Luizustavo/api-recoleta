import { UseCase } from '../use-case.interface'
import { Injectable, Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { JwtService } from '@nestjs/jwt'
import { ReturnCodeEnum } from '@/domain/enums/return-code.enum'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { LoginDto } from '../../dtos/auth/login.dto'
import { LoginResponseDto } from '../../dtos/auth/auth-response.dto'
import { ReturnBaseDTO } from '../../dtos/base/return-base.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class LoginUseCase
  implements UseCase<LoginDto, ReturnBaseDTO<LoginResponseDto>>
{
  constructor(
    @Inject('winston') private readonly logger: Logger,
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(request: LoginDto): Promise<ReturnBaseDTO<LoginResponseDto>> {
    this.logger.info('[Auth] LoginUseCase.execute - request', {
      request: { email: request.email, password: '***' },
    })
    const vm = new ReturnBaseDTO<LoginResponseDto>()
    try {
      const user = await this.userRepository.findAsync(request.email)
      if (!user) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'Credenciais inválidas'
        vm.success = false
        this.logger.warn('[Auth] LoginUseCase.userNotFound', {
          email: request.email,
        })
        return vm
      }

      const isMatch = await bcrypt.compare(
        request.password,
        user.password || '',
      )
      if (!isMatch) {
        vm.code = ReturnCodeEnum.NotFound
        vm.message = 'Credenciais inválidas'
        vm.success = false
        this.logger.warn('[Auth] LoginUseCase.invalidPassword', {
          email: request.email,
        })
        return vm
      }

      const payload = { id: user.id, email: user.email, name: user.name }
      const access_token = await this.jwtService.signAsync(payload)

      vm.code = ReturnCodeEnum.Success
      vm.message = 'Login successful'
      vm.success = true
      vm.data = { access_token, user: payload }
      this.logger.info('[Auth] LoginUseCase.success', {
        userId: user.id,
      })
    } catch (error) {
      this.logger.error('[Auth] LoginUseCase.error', { error })
      vm.code = ReturnCodeEnum.InternalError
      vm.message = 'Error during login'
      vm.success = false
    }
    return vm
  }
}
