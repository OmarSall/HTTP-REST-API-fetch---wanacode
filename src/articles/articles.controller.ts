import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ReplaceArticleDto } from './dto/replace-article.dto';
import { PatchArticleDto } from './dto/patch-article.dto';
import { ApiQuery } from '@nestjs/swagger';
import { SortByParamEnum } from './sort-by-param.enum';

@Controller('articles')
export default class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiQuery({ name: 'sortBy', required: false, enum: SortByParamEnum })
  @ApiQuery({ name: 'search', required: false, type: String })
  getAll(@Query('sortBy') sortBy: string, @Query('search') search: string) {
    if (search) {
      return this.articlesService.search(sortBy, search);
    }
    return this.articlesService.getAll(sortBy);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.articlesService.getById(id);
  }

  @Post()
  create(@Body() article: CreateArticleDto) {
    return this.articlesService.create(article);
  }

  @Put(':id')
  replace(@Param('id') id: string, @Body() article: ReplaceArticleDto) {
    return this.articlesService.replace(id, article);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() article: PatchArticleDto) {
    return this.articlesService.patch(id, article);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.articlesService.delete(id);
  }
}
