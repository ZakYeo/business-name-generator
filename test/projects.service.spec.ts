import { Test } from '@nestjs/testing';
import { InMemoryProjectsRepository } from '../src/projects/adapters/in-memory-projects.repository';
import { PROJECTS_REPOSITORY } from '../src/projects/ports/projects-repository.port';
import { ProjectsService } from '../src/projects/services/projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        InMemoryProjectsRepository,
        {
          provide: PROJECTS_REPOSITORY,
          useExisting: InMemoryProjectsRepository,
        },
        ProjectsService,
      ],
    }).compile();

    service = moduleRef.get(ProjectsService);
  });

  it('creates a project with trimmed values', async () => {
    const project = await service.createProject({
      businessDescription: '  AI naming tool for ecommerce brands  ',
      seedNames: [' Spark Forge '],
      targetMarket: ' UK ',
      tone: ' modern ',
      industry: ' retail ',
      desiredLength: 2,
      excludedWords: [' cheap '],
    });

    expect(project.title).toBe('AI naming tool for ecommerce brands');
    expect(project.seedNames).toEqual(['Spark Forge']);
    expect(project.targetMarket).toBe('UK');
    expect(project.preferences).toEqual({
      tone: 'modern',
      industry: 'retail',
      desiredLength: 2,
      excludedWords: ['cheap'],
    });
  });
});
