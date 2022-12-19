import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @RequestUser() user: User,
  ) {
    const data = await this.sessionsService.create(createSessionDto, user);

    return { message: 'Session created successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@RequestUser() user: User) {
    const data = await this.sessionsService.findAll(user);

    return { message: 'Sessions fetched successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':sessionId')
  async remove(
    @Param('sessionId') sessionId: string,
    @RequestUser() user: User,
  ) {
    await this.sessionsService.remove(sessionId, user);

    return { message: 'Session deleted successfully' };
  }
}
