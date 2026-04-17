import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InMemoryGenerationRunsRepository } from '../src/name-generation/adapters/in-memory-generation-runs.repository';
import { GenerateCandidatesDto } from '../src/name-generation/dto/generate-candidates.dto';
import { GENERATION_RUNS_REPOSITORY } from '../src/name-generation/ports/generation-runs-repository.port';
import { NAME_GENERATION_PORT } from '../src/name-generation/ports/name-generation.port';
import { NameGenerationService } from '../src/name-generation/services/name-generation.service';
import { InMemoryProjectsRepository } from '../src/projects/adapters/in-memory-projects.repository';
import { PROJECTS_REPOSITORY } from '../src/projects/ports/projects-repository.port';
import { ProjectsService } from '../src/projects/services/projects.service';

describe('NameGenerationService', () => {
  let service: NameGenerationService;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConfigService,
        InMemoryProjectsRepository,
        {
          provide: PROJECTS_REPOSITORY,
          useExisting: InMemoryProjectsRepository,
        },
        ProjectsService,
        InMemoryGenerationRunsRepository,
        {
          provide: GENERATION_RUNS_REPOSITORY,
          useExisting: InMemoryGenerationRunsRepository,
        },
        {
          provide: NAME_GENERATION_PORT,
          useValue: {
            generateCandidates: jest.fn().mockResolvedValue({
              model: 'fake-model',
              candidates: [
                {
                  name: 'North Ember',
                  rationale: 'Signals a strong modern brand.',
                  toneTags: ['modern'],
                  category: 'abstract',
                },
                {
                  name: 'North Ember',
                  rationale: 'Duplicate that should be removed.',
                  toneTags: ['modern'],
                  category: 'abstract',
                },
                {
                  name: 'Morrow Lane',
                  rationale: 'Feels premium and polished.',
                  toneTags: ['premium'],
                  category: 'compound',
                },
              ],
            }),
          },
        },
        NameGenerationService,
      ],
    }).compile();

    service = moduleRef.get(NameGenerationService);
    projectsService = moduleRef.get(ProjectsService);
  });

  it('generates, normalizes, and deduplicates candidates', async () => {
    const project = await projectsService.createProject({
      businessDescription: 'A business naming service for UK startups',
      targetMarket: 'UK',
    });

    const generationRun = await service.generateForProject(project.id, {
      candidateCount: 3,
    } satisfies GenerateCandidatesDto);

    expect(generationRun.status).toBe('generated');
    expect(generationRun.candidates).toHaveLength(2);
    expect(generationRun.candidates.map((candidate) => candidate.name)).toEqual(
      ['North Ember', 'Morrow Lane'],
    );
  });
});
