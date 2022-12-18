import { HydratedDocument, Types } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Course } from '../../courses/schemas/course.schema';
import { User } from '../../users/schemas/user.schema';

export type TutorDocument = HydratedDocument<Tutor>;

@Schema()
export class Tutor {
  _id: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop(
    raw({
      monday: { type: [Number] },
      tuesday: { type: [Number] },
      wednesday: { type: [Number] },
      thursday: { type: [Number] },
      friday: { type: [Number] },
      saturday: { type: [Number] },
      sunday: { type: [Number] },
    }),
  )
  availableTime: Record<string, number[]>;

  @Prop({ type: [Types.ObjectId], ref: Course.name })
  courses: Course[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const TutorSchema = SchemaFactory.createForClass(Tutor);