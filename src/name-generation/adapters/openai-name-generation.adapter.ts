import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import {
  NameGenerationPort,
  NameGenerationPortResult,
  NameGenerationRequest,
} from '../ports/name-generation.port';

const generatedCandidatesSchema = z.object({
  candidates: z.array(
    z.object({
      name: z.string().min(1),
      rationale: z.string().min(1),
      toneTags: z.array(z.string()).default([]),
      category: z.string().min(1),
    }),
  ),
});

@Injectable()
export class OpenAiNameGenerationAdapter implements NameGenerationPort {
  private readonly client: OpenAI | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async generateCandidates(
    request: NameGenerationRequest,
  ): Promise<NameGenerationPortResult> {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'OPENAI_API_KEY is missing. The OpenAI adapter cannot generate candidates.',
      );
    }

    const completion = await this.client.chat.completions.parse({
      model: request.model,
      messages: [
        {
          role: 'system',
          content: request.systemPrompt,
        },
        {
          role: 'user',
          content: request.userPrompt,
        },
      ],
      response_format: zodResponseFormat(
        generatedCandidatesSchema,
        'business_name_candidates',
      ),
    });

    const parsed = completion.choices[0]?.message?.parsed;

    if (!parsed) {
      throw new ServiceUnavailableException(
        'OpenAI did not return a structured candidate response.',
      );
    }

    return {
      candidates: parsed.candidates,
      model: completion.model,
      responseId: completion.id,
    };
  }
}
