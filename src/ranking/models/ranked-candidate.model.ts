import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';
import { DomainScreeningResult } from '../../candidate-evaluation/ports/domain-screening.port';
import { RegistryScreeningResult } from '../../candidate-evaluation/ports/registry-screening.port';
import { SearchSignalResult } from '../../candidate-evaluation/ports/search-signal.port';

export interface RankedCandidate {
  candidate: GeneratedCandidate;
  conflictRiskScore: number;
  distinctivenessScore: number;
  domainFitScore: number;
  keywordSignalScore: number;
  overallScore: number;
  warnings: string[];
  providerData: {
    registry: RegistryScreeningResult;
    domain: DomainScreeningResult;
    searchSignal: SearchSignalResult;
  };
}
