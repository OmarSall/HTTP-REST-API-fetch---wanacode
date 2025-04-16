import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplaceArticleDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string | null = null;
}
