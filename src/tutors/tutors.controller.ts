import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from '../users/schemas/user.schema';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { TutorListFilterDto } from './dto/tutor-list-filter.dto';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTutorDto: CreateTutorDto,
    @RequestUser() user: User,
  ) {
    const data = await this.tutorsService.create(createTutorDto, user);

    return { message: 'Tutor created', data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body() updateTutorDto: UpdateTutorDto,
    @RequestUser() user: User,
  ) {
    const data = await this.tutorsService.update(updateTutorDto, user);

    return { message: 'Tutor updated successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query() tutorListFilterDto: TutorListFilterDto,
    @RequestUser() user: User,
  ) {
    const data = await this.tutorsService.findAll(user, tutorListFilterDto);

    return { message: 'Tutors fetched successfully', data };
  }
}
