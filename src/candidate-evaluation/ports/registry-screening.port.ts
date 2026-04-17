import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';

export const REGISTRY_SCREENING_PORT = Symbol('REGISTRY_SCREENING_PORT');

export interface RegistryScreeningResult {
  exactMatch: boolean;
  matchedName?: string;
  similarityScore: number;
  similarNames: number;
}

export interface RegistryScreeningPort {
  screen(candidate: GeneratedCandidate): Promise<RegistryScreeningResult>;
}
