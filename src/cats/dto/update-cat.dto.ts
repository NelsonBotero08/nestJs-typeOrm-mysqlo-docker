import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCatDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsOptional()
  @IsString()
  breed?: string;
}
