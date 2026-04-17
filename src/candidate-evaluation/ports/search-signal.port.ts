import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';

export const SEARCH_SIGNAL_PORT = Symbol('SEARCH_SIGNAL_PORT');

export interface SearchSignalResult {
  score: number;
  monthlySearchEstimate: number;
  crowded: boolean;
}

export interface SearchSignalPort {
  screen(candidate: GeneratedCandidate): Promise<SearchSignalResult>;
}
