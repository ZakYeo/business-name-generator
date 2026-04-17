import { EvaluationResult } from '../models/evaluation-result.model';

export const EVALUATION_RESULTS_REPOSITORY = Symbol(
  'EVALUATION_RESULTS_REPOSITORY',
);

export interface EvaluationResultsRepositoryPort {
  save(evaluationResult: EvaluationResult): Promise<EvaluationResult>;
  findLatestByProjectId(
    projectId: string,
  ): Promise<EvaluationResult | undefined>;
}
