import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IUserRepository } from '@/domain/repositories/user-repository.interface'
import { LoginDto } from '@/application/dtos/auth/login.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findAsync(email)
    if (!user) return null
    const isMatch = await bcrypt.compare(password, user.password || '')
    if (!isMatch) return null
    return user
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) throw new UnauthorizedException('Credenciais inválidas')
    const payload = { id: user.id, email: user.email, name: user.name }
    const access_token = await this.jwtService.signAsync(payload)
    return { access_token, user: payload }
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token)
      return { valid: true, payload }
    } catch {
      return { valid: false }
    }
  }
}
