import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';

export class CategoryUpdate extends BaseModelVM {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: 'file' })
  image?: string;

  @ApiPropertyOptional()
  status?: boolean;
}
