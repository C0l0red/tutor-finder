import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    const data = await this.authService.login(user);

    return { message: 'Login successful', data };
  }
}
