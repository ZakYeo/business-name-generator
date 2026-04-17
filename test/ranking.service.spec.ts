import { RankingService } from '../src/ranking/services/ranking.service';

describe('RankingService', () => {
  it('computes an explainable score and warnings', () => {
    const service = new RankingService();

    const rankedCandidate = service.rankCandidate({
      candidate: {
        name: 'North Ember',
        rationale: 'Strong and memorable.',
        toneTags: ['modern'],
        category: 'abstract',
      },
      registry: {
        exactMatch: false,
        matchedName: 'North Ember Holdings Ltd',
        similarityScore: 68,
        similarNames: 4,
      },
      domain: {
        available: false,
        domain: 'northember.com',
        isPremium: false,
        priceUsd: 0,
      },
      searchSignal: {
        score: 72,
        monthlySearchEstimate: 1440,
        crowded: true,
      },
    });

    expect(rankedCandidate.overallScore).toBeGreaterThan(0);
    expect(rankedCandidate.warnings).toContain(
      'Primary .com domain is unavailable.',
    );
    expect(rankedCandidate.warnings).toContain(
      'Search landscape appears crowded.',
    );
  });
});
