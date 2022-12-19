import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tutor } from '../../tutors/schemas/tutor.schema';
import { User } from '../../users/schemas/user.schema';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  student: User;

  @Prop({ type: Types.ObjectId, ref: Tutor.name })
  tutor: Tutor;

  @Prop({ required: true })
  dayOfWeek: string;

  @Prop({ type: [Number], required: true })
  hours: number[];
}

export const SessionSchema = SchemaFactory.createForClass(Session);
