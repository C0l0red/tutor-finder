import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tutor, TutorSchema } from './schemas/tutor.schema';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tutor.name, schema: TutorSchema }]),
    CoursesModule,
  ],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
