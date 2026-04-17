import { Injectable } from '@nestjs/common';
import { EvaluationResult } from '../models/evaluation-result.model';
import { EvaluationResultsRepositoryPort } from '../ports/evaluation-results-repository.port';

@Injectable()
export class InMemoryEvaluationResultsRepository implements EvaluationResultsRepositoryPort {
  private readonly results = new Map<string, EvaluationResult[]>();

  async save(evaluationResult: EvaluationResult): Promise<EvaluationResult> {
    const existingResults = this.results.get(evaluationResult.projectId) ?? [];
    const nextResults = existingResults.filter(
      (existingResult) => existingResult.id !== evaluationResult.id,
    );

    nextResults.push(evaluationResult);
    this.results.set(evaluationResult.projectId, nextResults);

    return evaluationResult;
  }

  async findLatestByProjectId(
    projectId: string,
  ): Promise<EvaluationResult | undefined> {
    const projectResults = this.results.get(projectId) ?? [];
    return projectResults.at(-1);
  }
}
