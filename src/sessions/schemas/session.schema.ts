import { HydratedDocument } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {}

export const SessionSchema = SchemaFactory.createForClass(Session);
