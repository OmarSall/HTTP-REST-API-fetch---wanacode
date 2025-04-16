import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from './article';
import { CreateArticleDto } from './dto/create-article.dto';
// @ts-expect-error The lowdb library is an ESM library and this project is a CommonJS project
import type { Low } from 'lowdb';
import { v4 as uuid } from 'uuid';
import { ReplaceArticleDto } from './dto/replace-article.dto';
import { PatchArticleDto } from './dto/patch-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('DATABASE') private readonly database: Low<{ articles: Article[] }>,
  ) {}

  private isTitleAvailable(title: string, idToIgnore?: string) {
    const matchingArticle = this.database.data.articles.find((article) => {
      return article.title === title && article.id !== idToIgnore;
    });
    return matchingArticle === undefined;
  }

  getAll(sortBy: string) {
    if (sortBy === 'contentLength') {
      return this.getArticlesSortedByContentLength(this.database.data.articles);
    }
    return this.database.data.articles;
  }

  search(sortBy: string, searchQuery: string) {
    const filteredArticles = this.filterArticlesByQuery(searchQuery);
    if (sortBy === 'contentLength') {
      return this.getArticlesSortedByContentLength(filteredArticles);
    }
    return filteredArticles;
  }

  getById(id: string) {
    const article = this.database.data.articles.find(
      (article) => article.id === id,
    );
    if (article) {
      return article;
    }
    throw new NotFoundException();
  }

  async replace(id: string, article: ReplaceArticleDto) {
    const articleIndex = this.database.data.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    if (!this.isTitleAvailable(article.title, id)) {
      throw new ConflictException('Article with this title already exists');
    }
    this.database.data.articles[articleIndex] = {
      ...this.database.data.articles[articleIndex],
      title: article.title,
      content: article.content,
    };
    await this.database.write();
    return this.database.data.articles[articleIndex];
  }

  async patch(id: string, article: PatchArticleDto) {
    const articleIndex = this.database.data.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    if (!this.isTitleAvailable(article.title, id)) {
      throw new ConflictException('Article with this title already exists');
    }
    const articleToPatch = this.database.data.articles[articleIndex];
    if (article.title !== undefined) {
      articleToPatch.title = article.title;
    }
    if (article.content !== undefined) {
      articleToPatch.content = article.content;
    }
    await this.database.write();
    return articleToPatch;
  }

  async create(article: CreateArticleDto) {
    if (!this.isTitleAvailable(article.title)) {
      throw new ConflictException('Article with this title already exists');
    }
    const newArticle: Article = {
      id: uuid(),
      title: article.title,
      content: article.content,
    };
    this.database.data.articles.push(newArticle);
    await this.database.write();
    return newArticle;
  }

  async delete(id: string) {
    const articleIndex = this.database.data.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    this.database.data.articles.splice(articleIndex, 1);
    await this.database.write();
  }

  private filterArticlesByQuery(searchQuery: string) {
    const parsedQuery = searchQuery.toLocaleLowerCase();

    return this.database.data.articles.filter((article) => {
      const isTitleMatching = article.title
        .toLocaleLowerCase()
        .includes(parsedQuery);
      const isContentMatching =
        article.content &&
        article.content.toLocaleLowerCase().includes(parsedQuery);
      return isTitleMatching || isContentMatching;
    });
  }

  private getArticlesSortedByContentLength(articles: Article[]) {
    return articles.toSorted((firstArticle, secondArticle) => {
      const firstArticleLength = firstArticle.content?.length ?? 0;
      const secondArticleLength = secondArticle?.content?.length ?? 0;
      return secondArticleLength - firstArticleLength;
    });
  }
}
