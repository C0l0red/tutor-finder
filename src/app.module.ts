import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TutorsModule } from './tutors/tutors.module';
import { CoursesModule } from './courses/courses.module';
import { SessionsModule } from './sessions/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_PIPE } from '@nestjs/core';

config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env['MONGO_URI']),
    UsersModule,
    TutorsModule,
    CoursesModule,
    SessionsModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
