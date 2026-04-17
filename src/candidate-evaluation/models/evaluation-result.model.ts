import { RankedCandidate } from '../../ranking/models/ranked-candidate.model';

export interface EvaluationResult {
  id: string;
  projectId: string;
  generationRunId: string;
  rankedCandidates: RankedCandidate[];
  createdAt: string;
}
