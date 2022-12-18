import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Model, Types } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { AccountType } from '../users/enums/account-type.enum';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto, user: User) {
    if (user.accountType !== AccountType.TUTOR)
      throw new ForbiddenException('You cannot create a new course');

    await this.courseModel
      .findOne({ name: createCourseDto.name })
      .then((course) => {
        if (course) throw new ConflictException('Course already exists');
      });

    return this.courseModel.create(createCourseDto);
  }

  async find(courseIds?: string[]) {
    if (courseIds) {
      const ids = courseIds?.map((courseId) => new Types.ObjectId(courseId));
      return this.courseModel.find({ _id: { $in: ids } });
    }

    return this.courseModel.find();
  }

  async findById(courseId: string) {
    return this.courseModel.findById(courseId).then((course) => {
      if (!course) throw new NotFoundException('Course not found');
      return course;
    });
  }

  private async remove(courseId: string) {
    await this.courseModel.remove({ _id: new Types.ObjectId(courseId) });
  }
}
