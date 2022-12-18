import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @RequestUser() user: User,
  ) {
    const data = await this.coursesService.create(createCourseDto, user);

    return { message: 'Course created successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@RequestUser() user: User) {
    const data = await this.coursesService.find();

    return { message: 'Courses fetched successfully', data };
  }
}
