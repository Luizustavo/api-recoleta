import { Injectable } from '@nestjs/common'
import { AuthService } from '@/application/services/auth.service'
import { FacebookLoginDto } from '@/application/dtos/auth/facebook-login.dto'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class FacebookLoginUseCase {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: FacebookLoginDto) {
    const { accessToken } = dto

    // Verify Facebook token and fetch user info
    const response = await lastValueFrom(
      this.httpService.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
      ),
    )

    const { id, name, email } = response.data
    return this.authService.oAuthLogin({
      provider: 'facebook',
      providerId: id,
      email,
      name,
    })
  }
}
