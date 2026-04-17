import { Module } from '@nestjs/common';
import { RankingService } from './services/ranking.service';

@Module({
  providers: [RankingService],
  exports: [RankingService],
})
export class RankingModule {}
