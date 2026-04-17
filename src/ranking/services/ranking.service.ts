import { Injectable } from '@nestjs/common';
import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';
import { DomainScreeningResult } from '../../candidate-evaluation/ports/domain-screening.port';
import { RegistryScreeningResult } from '../../candidate-evaluation/ports/registry-screening.port';
import { SearchSignalResult } from '../../candidate-evaluation/ports/search-signal.port';
import { RankedCandidate } from '../models/ranked-candidate.model';

export interface RankCandidateInput {
  candidate: GeneratedCandidate;
  registry: RegistryScreeningResult;
  domain: DomainScreeningResult;
  searchSignal: SearchSignalResult;
}

@Injectable()
export class RankingService {
  rankCandidate(input: RankCandidateInput): RankedCandidate {
    const conflictRiskScore = Math.max(0, 100 - input.registry.similarityScore);
    const distinctivenessScore = Math.max(
      0,
      100 -
        input.registry.similarityScore +
        (input.candidate.name.length > 8 ? 5 : 0),
    );
    const domainFitScore = input.domain.available
      ? input.domain.isPremium
        ? 65
        : 90
      : 25;
    const keywordSignalScore = Math.min(100, input.searchSignal.score);
    const overallScore = Math.round(
      conflictRiskScore * 0.3 +
        distinctivenessScore * 0.25 +
        domainFitScore * 0.25 +
        keywordSignalScore * 0.2,
    );

    return {
      candidate: input.candidate,
      conflictRiskScore,
      distinctivenessScore,
      domainFitScore,
      keywordSignalScore,
      overallScore,
      warnings: this.buildWarnings(input, conflictRiskScore, domainFitScore),
      providerData: {
        registry: input.registry,
        domain: input.domain,
        searchSignal: input.searchSignal,
      },
    };
  }

  private buildWarnings(
    input: RankCandidateInput,
    conflictRiskScore: number,
    domainFitScore: number,
  ): string[] {
    const warnings: string[] = [];

    if (conflictRiskScore < 50) {
      warnings.push('High registry similarity risk.');
    }

    if (!input.domain.available) {
      warnings.push('Primary .com domain is unavailable.');
    }

    if (input.domain.isPremium) {
      warnings.push('The domain appears to be premium-priced.');
    }

    if (domainFitScore < 50) {
      warnings.push('Domain fit is weak for launch-readiness.');
    }

    if (input.searchSignal.crowded) {
      warnings.push('Search landscape appears crowded.');
    }

    return warnings;
  }
}
