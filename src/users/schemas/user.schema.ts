import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountType } from '../enums/account-type.enum';
import { Tutor } from '../../tutors/schemas/tutor.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false, unique: true })
  password: string;

  @Prop({ enum: AccountType, required: true })
  accountType: AccountType;

  @Prop({ type: Types.ObjectId, ref: 'Tutor' })
  tutor: Tutor;
}

export const UserSchema = SchemaFactory.createForClass(User);
