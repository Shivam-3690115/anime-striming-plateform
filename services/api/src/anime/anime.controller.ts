import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
  constructor(private animeService: AnimeService) {}

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.animeService.findAll(page, limit);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.animeService.search(query);
  }

  @Get('genre/:genre')
  async findByGenre(@Param('genre') genre: string) {
    return this.animeService.findByGenre(genre);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.animeService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() data: any) {
    return this.animeService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() data: any) {
    return this.animeService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return this.animeService.delete(id);
  }
}
