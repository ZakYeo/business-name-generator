import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { Project } from '../../projects/models/project.model';
import { ProjectsService } from '../../projects/services/projects.service';
import { GenerateCandidatesDto } from '../dto/generate-candidates.dto';
import { GeneratedCandidate } from '../models/generated-candidate.model';
import { GenerationRun } from '../models/generation-run.model';
import {
  GENERATION_RUNS_REPOSITORY,
  GenerationRunsRepositoryPort,
} from '../ports/generation-runs-repository.port';
import {
  NAME_GENERATION_PORT,
  NameGenerationPort,
} from '../ports/name-generation.port';

const candidateSchema = z.object({
  name: z.string().min(1),
  rationale: z.string().min(1),
  toneTags: z.array(z.string()),
  category: z.string().min(1),
});

@Injectable()
export class NameGenerationService {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly configService: ConfigService,
    @Inject(NAME_GENERATION_PORT)
    private readonly nameGenerationPort: NameGenerationPort,
    @Inject(GENERATION_RUNS_REPOSITORY)
    private readonly generationRunsRepository: GenerationRunsRepositoryPort,
  ) {}

  async generateForProject(
    projectId: string,
    input: GenerateCandidatesDto,
  ): Promise<GenerationRun> {
    const project = await this.projectsService.getProjectOrThrow(projectId);
    const requestedCandidateCount =
      input.candidateCount ??
      this.configService.get<number>('DEFAULT_CANDIDATE_COUNT', 12);

    const prompts = this.buildPrompts(project, requestedCandidateCount);
    const configuredModel = this.configService.get<string>(
      'OPENAI_MODEL',
      'gpt-4o-mini',
    );

    const generated = await this.nameGenerationPort.generateCandidates({
      project,
      candidateCount: requestedCandidateCount,
      model: configuredModel,
      ...prompts,
    });

    const candidates = this.normalizeCandidates(generated.candidates);
    const now = new Date().toISOString();

    if (candidates.length === 0) {
      throw new BadRequestException('No valid candidates were generated.');
    }

    const generationRun: GenerationRun = {
      id: randomUUID(),
      projectId,
      status: 'generated',
      requestedCandidateCount,
      candidates,
      systemPrompt: prompts.systemPrompt,
      userPrompt: prompts.userPrompt,
      model: generated.model,
      responseId: generated.responseId,
      createdAt: now,
      updatedAt: now,
    };

    return this.generationRunsRepository.save(generationRun);
  }

  async getLatestGenerationRun(
    projectId: string,
  ): Promise<GenerationRun | undefined> {
    return this.generationRunsRepository.findLatestByProjectId(projectId);
  }

  async getLatestGenerationRunOrThrow(
    projectId: string,
  ): Promise<GenerationRun> {
    const generationRun = await this.getLatestGenerationRun(projectId);

    if (!generationRun) {
      throw new NotFoundException(
        `No generation run exists yet for project ${projectId}.`,
      );
    }

    return generationRun;
  }

  async markGenerationRunEvaluated(
    generationRun: GenerationRun,
  ): Promise<GenerationRun> {
    return this.generationRunsRepository.save({
      ...generationRun,
      status: 'evaluated',
      updatedAt: new Date().toISOString(),
    });
  }

  private buildPrompts(project: Project, candidateCount: number) {
    const exclusions =
      project.preferences.excludedWords &&
      project.preferences.excludedWords.length > 0
        ? project.preferences.excludedWords.join(', ')
        : 'none';

    const seedNames =
      project.seedNames.length > 0 ? project.seedNames.join(', ') : 'none';

    return {
      systemPrompt:
        'You generate commercially usable business name candidates. Return only structured JSON and avoid duplicates.',
      userPrompt: [
        `Generate ${candidateCount} business name candidates.`,
        `Business description: ${project.businessDescription}`,
        `Target market: ${project.targetMarket}`,
        `Tone: ${project.preferences.tone ?? 'unspecified'}`,
        `Industry: ${project.preferences.industry ?? 'unspecified'}`,
        `Desired length: ${project.preferences.desiredLength ?? 'unspecified'}`,
        `Seed names: ${seedNames}`,
        `Excluded words: ${exclusions}`,
      ].join('\n'),
    };
  }

  private normalizeCandidates(
    candidates: GeneratedCandidate[],
  ): GeneratedCandidate[] {
    const seen = new Set<string>();

    return candidates
      .map((candidate) => candidateSchema.parse(candidate))
      .map((candidate) => ({
        ...candidate,
        name: candidate.name.trim(),
        rationale: candidate.rationale.trim(),
        toneTags: candidate.toneTags.map((toneTag) => toneTag.trim()),
        category: candidate.category.trim(),
      }))
      .filter((candidate) => {
        const normalizedName = candidate.name.toLowerCase();

        if (seen.has(normalizedName)) {
          return false;
        }

        seen.add(normalizedName);
        return true;
      });
  }
}
