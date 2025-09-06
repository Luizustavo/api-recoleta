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

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
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
