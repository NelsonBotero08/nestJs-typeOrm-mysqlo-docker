import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  age: number;

  @IsOptional()
  @IsString()
  breed?: string;
}
