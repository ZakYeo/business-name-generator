import { Injectable } from '@nestjs/common';
import { GeneratedCandidate } from '../../name-generation/models/generated-candidate.model';
import {
  DomainScreeningPort,
  DomainScreeningResult,
} from '../ports/domain-screening.port';

@Injectable()
export class StubDomainScreeningAdapter implements DomainScreeningPort {
  async screen(candidate: GeneratedCandidate): Promise<DomainScreeningResult> {
    const slug = candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const available = slug.length % 2 === 1;
    const isPremium = slug.length > 10;

    return {
      available,
      domain: `${slug}.com`,
      isPremium,
      priceUsd: available ? (isPremium ? 249 : 12) : 0,
    };
  }
}
