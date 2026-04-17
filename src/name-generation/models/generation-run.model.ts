import { GeneratedCandidate } from './generated-candidate.model';

export type GenerationStatus = 'pending' | 'generated' | 'evaluated' | 'failed';

export interface GenerationRun {
  id: string;
  projectId: string;
  status: GenerationStatus;
  requestedCandidateCount: number;
  candidates: GeneratedCandidate[];
  systemPrompt: string;
  userPrompt: string;
  model: string;
  responseId?: string;
  createdAt: string;
  updatedAt: string;
}
