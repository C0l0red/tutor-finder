import {
  IsDefined,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleDto {
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  monday: number[];

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  tuesday: number[];

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  wednesday: number[];

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  thursday: number[];

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  friday: number[];

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  saturday: number[];

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @IsOptional()
  sunday: number[];
}

export class CreateTutorDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsMongoId({ each: true })
  @IsNotEmpty()
  courses: string[];

  @IsObject()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  availableTime: ScheduleDto;
}
