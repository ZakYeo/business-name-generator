import { Project } from '../../projects/models/project.model';
import { GeneratedCandidate } from '../models/generated-candidate.model';

export const NAME_GENERATION_PORT = Symbol('NAME_GENERATION_PORT');

export interface NameGenerationRequest {
  project: Project;
  systemPrompt: string;
  userPrompt: string;
  candidateCount: number;
  model: string;
}

export interface NameGenerationPortResult {
  candidates: GeneratedCandidate[];
  model: string;
  responseId?: string;
}

export interface NameGenerationPort {
  generateCandidates(
    request: NameGenerationRequest,
  ): Promise<NameGenerationPortResult>;
}
