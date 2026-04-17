import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CandidateEvaluationService } from '../../candidate-evaluation/services/candidate-evaluation.service';
import { GenerateCandidatesDto } from '../../name-generation/dto/generate-candidates.dto';
import { NameGenerationService } from '../../name-generation/services/name-generation.service';
import { CreateProjectDto } from '../../projects/dto/create-project.dto';
import { ProjectsService } from '../../projects/services/projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly nameGenerationService: NameGenerationService,
    private readonly candidateEvaluationService: CandidateEvaluationService,
  ) {}

  @Post()
  async createProject(@Body() input: CreateProjectDto) {
    return this.projectsService.createProject(input);
  }

  @Post(':projectId/generate')
  async generateCandidates(
    @Param('projectId') projectId: string,
    @Body() input: GenerateCandidatesDto,
  ) {
    return this.nameGenerationService.generateForProject(projectId, input);
  }

  @Post(':projectId/evaluate')
  async evaluateCandidates(@Param('projectId') projectId: string) {
    return this.candidateEvaluationService.evaluateProject(projectId);
  }

  @Get(':projectId/results')
  async getProjectResults(@Param('projectId') projectId: string) {
    const [project, generationRun, evaluationResult] = await Promise.all([
      this.projectsService.getProjectOrThrow(projectId),
      this.nameGenerationService.getLatestGenerationRun(projectId),
      this.candidateEvaluationService.getLatestEvaluationResult(projectId),
    ]);

    return {
      project,
      generationRun,
      evaluationResult,
    };
  }
}
