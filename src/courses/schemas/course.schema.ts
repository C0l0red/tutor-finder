import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 0 })
  numberOfTutors: number;

  @Prop({ required: true, default: 0 })
  numberOfStudents: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
