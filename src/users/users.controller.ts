import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);

    return { message: 'User created successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @RequestUser() user: User,
  ) {
    const data = await this.usersService.update(updateUserDto, user);

    return { message: 'User updated successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@RequestUser() user: User) {
    await this.usersService.remove(user);

    return { message: 'User deleted successfully' };
  }
}
