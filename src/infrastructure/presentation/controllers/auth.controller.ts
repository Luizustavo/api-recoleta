import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto } from '@/application/dtos/auth/login.dto'
import { ValidateTokenDto } from '@/application/dtos/auth/validate-token.dto'
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { ValidateTokenUseCase } from '@/application/use-cases/auth/validate-token.use-case'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(loginDto)
  }

  @Post('validate-token')
  async validateToken(@Body() dto: ValidateTokenDto) {
    return await this.validateTokenUseCase.execute(dto.token)
  }

  @Get('validate')
  async validateTokenFromHeader(
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization?.replace(/^Bearer /i, '')
    return await this.validateTokenUseCase.execute(token)
  }
}
