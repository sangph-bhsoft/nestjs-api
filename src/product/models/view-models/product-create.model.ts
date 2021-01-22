import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';

export class ProductCreate extends BaseModelVM {
  @ApiPropertyOptional()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ type: 'file' })
  image?: any;

  @ApiPropertyOptional()
  @IsNotEmpty()
  category_id: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional()
  status?: boolean;
}
