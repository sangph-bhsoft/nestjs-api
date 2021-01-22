import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';

export class ProductUpdate extends BaseModelVM {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ type: 'file' })
  image?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  category_id: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional()
  status?: boolean;
}
