import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';
import { DayOfWeek } from '../enums/day-of-week.enum';

export class CreateSessionDto {
  @IsMongoId()
  @IsNotEmpty()
  tutorId: string;

  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: string;

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsNotEmpty()
  hours: number[];
}
