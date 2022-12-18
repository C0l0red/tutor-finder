import { IsMongoId, IsOptional } from 'class-validator';

export class TutorListFilterDto {
  @IsMongoId()
  @IsOptional()
  course: string;
}
