import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GenerateCandidatesDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  candidateCount?: number;
}
