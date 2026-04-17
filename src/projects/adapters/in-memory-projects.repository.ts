import { Injectable } from '@nestjs/common';
import { Project } from '../models/project.model';
import { ProjectsRepositoryPort } from '../ports/projects-repository.port';

@Injectable()
export class InMemoryProjectsRepository implements ProjectsRepositoryPort {
  private readonly projects = new Map<string, Project>();

  async save(project: Project): Promise<Project> {
    this.projects.set(project.id, project);
    return project;
  }

  async findById(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }
}
