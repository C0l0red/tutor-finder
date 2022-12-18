import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tutor, TutorDocument } from './schemas/tutor.schema';
import { Model, Types } from 'mongoose';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { User } from '../users/schemas/user.schema';
import { CoursesService } from '../courses/courses.service';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { AccountType } from '../users/enums/account-type.enum';
import { TutorListFilterDto } from './dto/tutor-list-filter.dto';

@Injectable()
export class TutorsService {
  constructor(
    @InjectModel(Tutor.name) private readonly tutorModel: Model<TutorDocument>,
    private readonly coursesService: CoursesService,
  ) {}

  async create(createTutorDto: CreateTutorDto, user: User) {
    const courseIds = await this.verifyAccountTypeAndGetCourseIds(
      user,
      createTutorDto.courses,
    );

    await this.tutorModel
      .findOne({ user: new Types.ObjectId(user._id) })
      .then((tutor) => {
        if (tutor)
          throw new ConflictException('You already have a tutor profile');
      });

    return this.tutorModel.create({
      ...createTutorDto,
      courses: courseIds,
      user: new Types.ObjectId(user._id),
    });
  }

  async update(updateTutorDto: UpdateTutorDto, user: User) {
    const courseIds = await this.verifyAccountTypeAndGetCourseIds(
      user,
      updateTutorDto.courses,
    );

    if (courseIds) {
      updateTutorDto.courses = courseIds;
    }

    return this.tutorModel.findOneAndUpdate(
      { user: new Types.ObjectId(user._id) },
      updateTutorDto,
    );
  }

  async findAll(user: User, tutorListFilterDto?: TutorListFilterDto) {
    if (user.accountType !== AccountType.STUDENT)
      throw new ForbiddenException();

    if (tutorListFilterDto.course)
      return this.tutorModel.find({
        courses: { $in: [new Types.ObjectId(tutorListFilterDto.course)] },
      });

    return this.tutorModel.find();
  }

  private async verifyAccountTypeAndGetCourseIds(
    user: User,
    courseIds?: string[],
  ) {
    if (user.accountType !== AccountType.TUTOR) throw new ForbiddenException();

    if (courseIds?.length > 0)
      return this.coursesService.find(courseIds).then((courses) => {
        if (courses.length === 0)
          throw new BadRequestException('No course found');

        return courses.map((course) => course._id);
      });

    return null;
  }
}
