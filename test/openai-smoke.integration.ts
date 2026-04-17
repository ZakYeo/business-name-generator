import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { OpenAiNameGenerationAdapter } from '../src/name-generation/adapters/openai-name-generation.adapter';
import { Project } from '../src/projects/models/project.model';

const loadEnvFromFile = () => {
  const envPath = resolve(process.cwd(), '.env');
  const envContents = readFileSync(envPath, 'utf8');

  for (const line of envContents.split('\n')) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

loadEnvFromFile();

describe('OpenAI smoke integration', () => {
  const testCase = process.env.OPENAI_API_KEY ? it : it.skip;

  testCase(
    'returns structured candidates from the live OpenAI adapter',
    async () => {
      const adapter = new OpenAiNameGenerationAdapter(
        new ConfigService({
          OPENAI_API_KEY: process.env.OPENAI_API_KEY,
          OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        }),
      );

      const project: Project = {
        id: 'project-smoke',
        title: 'Smoke Test Project',
        businessDescription:
          'A backend tool that generates strong company names for founders.',
        seedNames: ['North Ember'],
        targetMarket: 'UK',
        preferences: {
          tone: 'modern',
          industry: 'software',
          desiredLength: 2,
          excludedWords: ['cheap'],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await adapter.generateCandidates({
        project,
        candidateCount: 3,
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        systemPrompt:
          'Generate structured business name candidates. Return valid JSON only.',
        userPrompt:
          'Generate 3 backend-friendly business names for a modern software brand.',
      });

      expect(result.candidates).toHaveLength(3);
      expect(result.candidates[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          rationale: expect.any(String),
          toneTags: expect.any(Array),
          category: expect.any(String),
        }),
      );
    },
  );
});
