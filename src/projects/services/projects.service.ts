import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProjectDto } from '../dto/create-project.dto';
import { Project } from '../models/project.model';
import {
  PROJECTS_REPOSITORY,
  ProjectsRepositoryPort,
} from '../ports/projects-repository.port';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepositoryPort,
  ) {}

  async createProject(input: CreateProjectDto): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: randomUUID(),
      title:
        input.title?.trim() ||
        this.buildProjectTitle(input.businessDescription),
      businessDescription: input.businessDescription.trim(),
      seedNames: input.seedNames?.map((seedName) => seedName.trim()) ?? [],
      targetMarket: input.targetMarket.trim(),
      preferences: {
        tone: input.tone?.trim(),
        industry: input.industry?.trim(),
        desiredLength: input.desiredLength,
        excludedWords: input.excludedWords?.map((word) => word.trim()) ?? [],
      },
      createdAt: now,
      updatedAt: now,
    };

    return this.projectsRepository.save(project);
  }

  async getProjectOrThrow(projectId: string): Promise<Project> {
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException(`Project ${projectId} was not found.`);
    }

    return project;
  }

  private buildProjectTitle(businessDescription: string): string {
    const title = businessDescription.trim().split(/\s+/).slice(0, 6).join(' ');
    return title.length > 0 ? title : 'Untitled project';
  }
}
