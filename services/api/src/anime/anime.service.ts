import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from './anime.entity';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private animeRepository: Repository<Anime>,
  ) {}

  async findAll(page: number = 1, limit: number = 20): Promise<Anime[]> {
    return this.animeRepository.find({
      where: { isPublished: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Anime> {
    return this.animeRepository.findOne({ where: { id } });
  }

  async search(query: string): Promise<Anime[]> {
    return this.animeRepository
      .createQueryBuilder('anime')
      .where('anime.title ILIKE :query', { query: `%${query}%` })
      .andWhere('anime.isPublished = :published', { published: true })
      .getMany();
  }

  async findByGenre(genre: string): Promise<Anime[]> {
    return this.animeRepository
      .createQueryBuilder('anime')
      .where(':genre = ANY(anime.genres)', { genre })
      .andWhere('anime.isPublished = :published', { published: true })
      .getMany();
  }

  async create(data: Partial<Anime>): Promise<Anime> {
    const anime = this.animeRepository.create(data);
    return this.animeRepository.save(anime);
  }

  async update(id: string, data: Partial<Anime>): Promise<Anime> {
    await this.animeRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.animeRepository.delete(id);
  }
}
