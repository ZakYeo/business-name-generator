import { Module } from '@nestjs/common';
import { CandidateEvaluationModule } from '../candidate-evaluation/candidate-evaluation.module';
import { NameGenerationModule } from '../name-generation/name-generation.module';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectsController } from './controllers/projects.controller';

@Module({
  imports: [ProjectsModule, NameGenerationModule, CandidateEvaluationModule],
  controllers: [ProjectsController],
})
export class ProjectsApiModule {}
