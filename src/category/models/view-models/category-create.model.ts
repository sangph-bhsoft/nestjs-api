import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';

export class CategoryCreate extends BaseModelVM {
  @ApiPropertyOptional()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'file' })
  image?: any;

  @ApiPropertyOptional()
  status?: boolean;
}
