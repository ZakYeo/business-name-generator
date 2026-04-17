import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-4o-mini'),
  DEFAULT_CANDIDATE_COUNT: z.coerce.number().int().min(1).max(100).default(12),
  POSTGRES_DB: z.string().min(1).default('business_name_generator'),
  POSTGRES_USER: z.string().min(1).default('postgres'),
  POSTGRES_PASSWORD: z.string().min(1).default('postgres'),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
});

export type Environment = z.infer<typeof environmentSchema>;

export const validateEnvironment = (
  config: Record<string, unknown>,
): Environment => environmentSchema.parse(config);
