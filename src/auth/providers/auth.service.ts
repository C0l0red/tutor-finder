import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.verifyPassword(user, password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayloadDto = {
      sub: user._id,
      username: user.email,
      accountType: user.accountType,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      },
    };
  }
}
