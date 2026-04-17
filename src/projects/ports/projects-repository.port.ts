import { Project } from '../models/project.model';

export const PROJECTS_REPOSITORY = Symbol('PROJECTS_REPOSITORY');

export interface ProjectsRepositoryPort {
  save(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | undefined>;
}
