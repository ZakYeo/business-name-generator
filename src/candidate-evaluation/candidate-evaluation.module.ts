import { Module } from '@nestjs/common';
import { NameGenerationModule } from '../name-generation/name-generation.module';
import { ProjectsModule } from '../projects/projects.module';
import { RankingModule } from '../ranking/ranking.module';
import { InMemoryEvaluationResultsRepository } from './adapters/in-memory-evaluation-results.repository';
import { StubDomainScreeningAdapter } from './adapters/stub-domain-screening.adapter';
import { StubRegistryScreeningAdapter } from './adapters/stub-registry-screening.adapter';
import { StubSearchSignalAdapter } from './adapters/stub-search-signal.adapter';
import { DOMAIN_SCREENING_PORT } from './ports/domain-screening.port';
import { EVALUATION_RESULTS_REPOSITORY } from './ports/evaluation-results-repository.port';
import { REGISTRY_SCREENING_PORT } from './ports/registry-screening.port';
import { SEARCH_SIGNAL_PORT } from './ports/search-signal.port';
import { CandidateEvaluationService } from './services/candidate-evaluation.service';

@Module({
  imports: [ProjectsModule, NameGenerationModule, RankingModule],
  providers: [
    InMemoryEvaluationResultsRepository,
    {
      provide: EVALUATION_RESULTS_REPOSITORY,
      useExisting: InMemoryEvaluationResultsRepository,
    },
    StubRegistryScreeningAdapter,
    {
      provide: REGISTRY_SCREENING_PORT,
      useExisting: StubRegistryScreeningAdapter,
    },
    StubDomainScreeningAdapter,
    {
      provide: DOMAIN_SCREENING_PORT,
      useExisting: StubDomainScreeningAdapter,
    },
    StubSearchSignalAdapter,
    {
      provide: SEARCH_SIGNAL_PORT,
      useExisting: StubSearchSignalAdapter,
    },
    CandidateEvaluationService,
  ],
  exports: [EVALUATION_RESULTS_REPOSITORY, CandidateEvaluationService],
})
export class CandidateEvaluationModule {}
