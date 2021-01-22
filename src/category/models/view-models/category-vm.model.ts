import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';

export class CategoryVm extends BaseModelVM {
  @ApiProperty() name: string;
  @ApiPropertyOptional() image: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() status: boolean;
}
