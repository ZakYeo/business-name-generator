import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsString()
  @MaxLength(2000)
  businessDescription!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  seedNames?: string[];

  @IsString()
  @MaxLength(100)
  targetMarket!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  tone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  desiredLength?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  excludedWords?: string[];
}
