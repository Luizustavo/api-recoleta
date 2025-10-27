import { Injectable } from '@nestjs/common'
import { AuthService } from '@/application/services/auth.service'
import { GoogleLoginDto } from '@/application/dtos/auth/google-login.dto'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { AxiosResponse } from 'axios'

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}
  async execute(dto: GoogleLoginDto) {
    const { token } = dto

    // Verify Google token
    type GoogleTokenInfo = {
      email?: string
      name?: string
      sub?: string
      [key: string]: any
    }

    const response = (await lastValueFrom(
      this.httpService.get<GoogleTokenInfo>(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
      ),
    )) as AxiosResponse<GoogleTokenInfo>

    const { email, name, sub } = response.data ?? {}
    return this.authService.oAuthLogin({
      provider: 'google',
      providerId: sub,
      email,
      name,
    })
  }
}
