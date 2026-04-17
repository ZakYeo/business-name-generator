import { Test } from '@nestjs/testing';
import { CandidateEvaluationService } from '../src/candidate-evaluation/services/candidate-evaluation.service';
import { CandidateEvaluationModule } from '../src/candidate-evaluation/candidate-evaluation.module';
import { NameGenerationService } from '../src/name-generation/services/name-generation.service';
import { NameGenerationModule } from '../src/name-generation/name-generation.module';
import { NAME_GENERATION_PORT } from '../src/name-generation/ports/name-generation.port';
import { ProjectsModule } from '../src/projects/projects.module';
import { ProjectsService } from '../src/projects/services/projects.service';
import { RankingModule } from '../src/ranking/ranking.module';
import { ConfigModule } from '@nestjs/config';

describe('CandidateEvaluationService', () => {
  let projectsService: ProjectsService;
  let evaluationService: CandidateEvaluationService;
  let nameGenerationService: NameGenerationService;
  let nameGenerationPort: { generateCandidates: jest.Mock };

  beforeEach(async () => {
    nameGenerationPort = {
      generateCandidates: jest.fn().mockResolvedValue({
        model: 'fake-model',
        candidates: [
          {
            name: 'North Ember',
            rationale: 'Strong and modern.',
            toneTags: ['modern'],
            category: 'abstract',
          },
          {
            name: 'Brass Lane',
            rationale: 'Feels established.',
            toneTags: ['premium'],
            category: 'compound',
          },
        ],
      }),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              DEFAULT_CANDIDATE_COUNT: 2,
              OPENAI_MODEL: 'fake-model',
            }),
          ],
        }),
        ProjectsModule,
        NameGenerationModule,
        RankingModule,
        CandidateEvaluationModule,
      ],
    })
      .overrideProvider(NAME_GENERATION_PORT)
      .useValue(nameGenerationPort)
      .compile();

    projectsService = moduleRef.get(ProjectsService);
    evaluationService = moduleRef.get(CandidateEvaluationService);
    nameGenerationService = moduleRef.get(NameGenerationService);
  });

  it('evaluates every generated candidate and returns ranked output', async () => {
    const project = await projectsService.createProject({
      businessDescription: 'A naming platform for startup founders',
      targetMarket: 'UK',
    });

    await nameGenerationService.generateForProject(project.id, {
      candidateCount: 2,
    });

    const evaluation = await evaluationService.evaluateProject(project.id);

    expect(evaluation.rankedCandidates).toHaveLength(2);
    expect(evaluation.rankedCandidates[0]!.overallScore).toBeGreaterThanOrEqual(
      evaluation.rankedCandidates[1]!.overallScore,
    );
  });
});
