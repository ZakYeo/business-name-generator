import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { InMemoryGenerationRunsRepository } from './adapters/in-memory-generation-runs.repository';
import { OpenAiNameGenerationAdapter } from './adapters/openai-name-generation.adapter';
import { GENERATION_RUNS_REPOSITORY } from './ports/generation-runs-repository.port';
import { NAME_GENERATION_PORT } from './ports/name-generation.port';
import { NameGenerationService } from './services/name-generation.service';

@Module({
  imports: [ProjectsModule],
  providers: [
    InMemoryGenerationRunsRepository,
    {
      provide: GENERATION_RUNS_REPOSITORY,
      useExisting: InMemoryGenerationRunsRepository,
    },
    OpenAiNameGenerationAdapter,
    {
      provide: NAME_GENERATION_PORT,
      useExisting: OpenAiNameGenerationAdapter,
    },
    NameGenerationService,
  ],
  exports: [
    GENERATION_RUNS_REPOSITORY,
    NAME_GENERATION_PORT,
    NameGenerationService,
  ],
})
export class NameGenerationModule {}
