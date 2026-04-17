import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NameGenerationService } from '../../name-generation/services/name-generation.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { RankingService } from '../../ranking/services/ranking.service';
import { EvaluationResult } from '../models/evaluation-result.model';
import {
  DOMAIN_SCREENING_PORT,
  DomainScreeningPort,
} from '../ports/domain-screening.port';
import {
  EVALUATION_RESULTS_REPOSITORY,
  EvaluationResultsRepositoryPort,
} from '../ports/evaluation-results-repository.port';
import {
  REGISTRY_SCREENING_PORT,
  RegistryScreeningPort,
} from '../ports/registry-screening.port';
import {
  SEARCH_SIGNAL_PORT,
  SearchSignalPort,
} from '../ports/search-signal.port';

@Injectable()
export class CandidateEvaluationService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly nameGenerationService: NameGenerationService,
    private readonly rankingService: RankingService,
    @Inject(REGISTRY_SCREENING_PORT)
    private readonly registryScreeningPort: RegistryScreeningPort,
    @Inject(DOMAIN_SCREENING_PORT)
    private readonly domainScreeningPort: DomainScreeningPort,
    @Inject(SEARCH_SIGNAL_PORT)
    private readonly searchSignalPort: SearchSignalPort,
    @Inject(EVALUATION_RESULTS_REPOSITORY)
    private readonly evaluationResultsRepository: EvaluationResultsRepositoryPort,
  ) {}

  async evaluateProject(projectId: string): Promise<EvaluationResult> {
    await this.projectsService.getProjectOrThrow(projectId);
    const generationRun =
      await this.nameGenerationService.getLatestGenerationRunOrThrow(projectId);

    const rankedCandidates = await Promise.all(
      generationRun.candidates.map(async (candidate) => {
        const [registry, domain, searchSignal] = await Promise.all([
          this.registryScreeningPort.screen(candidate),
          this.domainScreeningPort.screen(candidate),
          this.searchSignalPort.screen(candidate),
        ]);

        return this.rankingService.rankCandidate({
          candidate,
          registry,
          domain,
          searchSignal,
        });
      }),
    );

    rankedCandidates.sort(
      (left, right) => right.overallScore - left.overallScore,
    );

    const evaluationResult: EvaluationResult = {
      id: randomUUID(),
      projectId,
      generationRunId: generationRun.id,
      rankedCandidates,
      createdAt: new Date().toISOString(),
    };

    await this.evaluationResultsRepository.save(evaluationResult);
    await this.nameGenerationService.markGenerationRunEvaluated(generationRun);

    return evaluationResult;
  }

  async getLatestEvaluationResult(
    projectId: string,
  ): Promise<EvaluationResult | undefined> {
    return this.evaluationResultsRepository.findLatestByProjectId(projectId);
  }
}
