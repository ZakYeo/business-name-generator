import { Injectable } from '@nestjs/common';
import { GenerationRun } from '../models/generation-run.model';
import { GenerationRunsRepositoryPort } from '../ports/generation-runs-repository.port';

@Injectable()
export class InMemoryGenerationRunsRepository implements GenerationRunsRepositoryPort {
  private readonly generationRuns = new Map<string, GenerationRun[]>();

  async save(generationRun: GenerationRun): Promise<GenerationRun> {
    const projectGenerationRuns =
      this.generationRuns.get(generationRun.projectId) ?? [];

    const nextGenerationRuns = projectGenerationRuns.filter(
      (existingGenerationRun) => existingGenerationRun.id !== generationRun.id,
    );

    nextGenerationRuns.push(generationRun);
    this.generationRuns.set(generationRun.projectId, nextGenerationRuns);

    return generationRun;
  }

  async findLatestByProjectId(
    projectId: string,
  ): Promise<GenerationRun | undefined> {
    const generationRuns = this.generationRuns.get(projectId) ?? [];
    return generationRuns.at(-1);
  }
}
