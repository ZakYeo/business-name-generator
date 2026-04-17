import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';

export const DOMAIN_SCREENING_PORT = Symbol('DOMAIN_SCREENING_PORT');

export interface DomainScreeningResult {
  available: boolean;
  domain: string;
  isPremium: boolean;
  priceUsd: number;
}

export interface DomainScreeningPort {
  screen(candidate: GeneratedCandidate): Promise<DomainScreeningResult>;
}
