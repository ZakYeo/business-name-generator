import { Injectable } from '@nestjs/common';
import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';
import {
  RegistryScreeningPort,
  RegistryScreeningResult,
} from '../ports/registry-screening.port';

@Injectable()
export class StubRegistryScreeningAdapter implements RegistryScreeningPort {
  async screen(
    candidate: GeneratedCandidate,
  ): Promise<RegistryScreeningResult> {
    const similarityScore = this.score(candidate.name);
    return {
      exactMatch: similarityScore > 90,
      matchedName:
        similarityScore > 70 ? `${candidate.name} Holdings Ltd` : undefined,
      similarityScore,
      similarNames: Math.max(1, Math.round(similarityScore / 15)),
    };
  }

  private score(value: string): number {
    return (
      [...value].reduce(
        (total, character) => total + character.charCodeAt(0),
        0,
      ) % 100
    );
  }
}
