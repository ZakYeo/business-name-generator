import { Injectable } from '@nestjs/common';
import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';
import {
  SearchSignalPort,
  SearchSignalResult,
} from '../ports/search-signal.port';

@Injectable()
export class StubSearchSignalAdapter implements SearchSignalPort {
  async screen(candidate: GeneratedCandidate): Promise<SearchSignalResult> {
    const normalizedLength = candidate.name.replace(/\s+/g, '').length;
    const score = Math.max(30, 100 - normalizedLength * 4);

    return {
      score,
      monthlySearchEstimate: score * 20,
      crowded: normalizedLength < 7,
    };
  }
}
