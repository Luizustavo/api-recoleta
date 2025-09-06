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
import { AuthService } from '@/application/services/auth.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @Post('validate-token')
  async validateToken(@Body() dto: ValidateTokenDto) {
    return await this.authService.validateToken(dto.token)
  }

  @Get('validate')
  async validateTokenFromHeader(
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization?.replace(/^Bearer /i, '')
    return await this.authService.validateToken(token)
  }
}
