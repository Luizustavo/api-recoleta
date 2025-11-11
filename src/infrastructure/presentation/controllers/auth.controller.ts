import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { LoginDto } from '@/application/dtos/auth/login.dto'
import { ValidateTokenDto } from '@/application/dtos/auth/validate-token.dto'
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case'
import { ValidateTokenUseCase } from '@/application/use-cases/auth/validate-token.use-case'
import { GoogleLoginUseCase } from '@/application/use-cases/auth/google-login.use-case'
import { FacebookLoginUseCase } from '@/application/use-cases/auth/facebook-login.use-case'
import { GoogleLoginDto } from '@/application/dtos/auth/google-login.dto'
import { FacebookLoginDto } from '@/application/dtos/auth/facebook-login.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly facebookLoginUseCase: FacebookLoginUseCase,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async signIn(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(loginDto)
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login com Google OAuth' })
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return await this.googleLoginUseCase.execute(dto)
  }

  @Post('facebook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login com Facebook OAuth' })
  async facebookLogin(@Body() dto: FacebookLoginDto) {
    return await this.facebookLoginUseCase.execute(dto)
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validar token JWT via body' })
  @ApiResponse({ status: 200, description: 'Token validado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 400, description: 'Token não fornecido' })
  async validateToken(@Body() dto: ValidateTokenDto) {
    return await this.validateTokenUseCase.execute(dto.token)
  }

  @Get('validate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validar token JWT via header' })
  @ApiResponse({ status: 200, description: 'Token validado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async validateTokenFromHeader(
    @Headers('authorization') authorization: string,
  ) {
    const token = authorization?.replace(/^Bearer /i, '')
    return await this.validateTokenUseCase.execute(token)
  }
}
