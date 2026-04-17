import { Module } from '@nestjs/common';
import { InMemoryProjectsRepository } from './adapters/in-memory-projects.repository';
import { PROJECTS_REPOSITORY } from './ports/projects-repository.port';
import { ProjectsService } from './services/projects.service';

@Module({
  providers: [
    InMemoryProjectsRepository,
    {
      provide: PROJECTS_REPOSITORY,
      useExisting: InMemoryProjectsRepository,
    },
    ProjectsService,
  ],
  exports: [PROJECTS_REPOSITORY, ProjectsService],
})
export class ProjectsModule {}
