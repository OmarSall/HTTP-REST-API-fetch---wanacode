import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class PatchArticleDto {
  @CanBeUndefined()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string | null;
}
