import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schemas/session.schema';
import { Model, Types } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { AccountType } from '../users/enums/account-type.enum';
import { TutorsService } from '../tutors/tutors.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private readonly tutorsService: TutorsService,
  ) {}

  async create(createSessionDto: CreateSessionDto, user: User) {
    if (user.accountType !== AccountType.STUDENT)
      throw new ForbiddenException('You cannot book a session');

    const tutor = await this.tutorsService.findById(createSessionDto.tutorId);

    const availableHours: number[] =
      tutor.availableTime[createSessionDto.dayOfWeek];
    if (!createSessionDto.hours.every((hour) => availableHours.includes(hour)))
      throw new BadRequestException(
        'Tutor is not free within all of those hours',
      );

    tutor.availableTime[createSessionDto.dayOfWeek] = availableHours.filter(
      (hour) => !createSessionDto.hours.includes(hour),
    );

    await tutor.save();

    return this.sessionModel.create({
      tutor: tutor._id,
      student: new Types.ObjectId(user._id),
      ...createSessionDto,
    });
  }

  async findAll(user: User) {
    const userId = new Types.ObjectId(user._id);
    const filter =
      user.accountType === AccountType.TUTOR
        ? { tutor: userId }
        : { student: userId };

    return this.sessionModel.find(filter).populate(['student', 'tutor']);
  }

  async remove(sessionId: string, user: User) {
    const filter =
      user.accountType === AccountType.STUDENT
        ? { student: new Types.ObjectId(user._id) }
        : { tutor: new Types.ObjectId(user._id) };

    const session = await this.sessionModel
      .findOne({ _id: new Types.ObjectId(sessionId), ...filter })
      .then((session) => {
        if (!session) throw new NotFoundException('Session not found');
        return session;
      });

    const tutor = await this.tutorsService.findById(session.tutor.toString());

    tutor.availableTime[session.dayOfWeek].push(...session.hours);

    await Promise.all([
      this.sessionModel.deleteOne({ _id: session._id }),
      tutor.save(),
    ]);
  }
}
