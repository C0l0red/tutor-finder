import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString()
  @ValidateIf((dto) => !!dto.oldPassword)
  newPassword: string;
}
