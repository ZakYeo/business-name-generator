import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { validateEnvironment } from './config/environment';
import { CandidateEvaluationModule } from './candidate-evaluation/candidate-evaluation.module';
import { NameGenerationModule } from './name-generation/name-generation.module';
import { ProjectsApiModule } from './projects-api/projects-api.module';
import { ProjectsModule } from './projects/projects.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    ProjectsModule,
    NameGenerationModule,
    RankingModule,
    CandidateEvaluationModule,
    ProjectsApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
