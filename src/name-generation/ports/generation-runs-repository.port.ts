import { GenerationRun } from '../models/generation-run.model';

export const GENERATION_RUNS_REPOSITORY = Symbol('GENERATION_RUNS_REPOSITORY');

export interface GenerationRunsRepositoryPort {
  save(generationRun: GenerationRun): Promise<GenerationRun>;
  findLatestByProjectId(projectId: string): Promise<GenerationRun | undefined>;
}
