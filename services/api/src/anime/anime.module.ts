import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from './anime.entity';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Anime])],
  providers: [AnimeService],
  controllers: [AnimeController],
  exports: [AnimeService],
})
export class AnimeModule {}
