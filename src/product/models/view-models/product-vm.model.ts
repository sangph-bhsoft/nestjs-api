import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';

export class ProductVm extends BaseModelVM {
  @ApiProperty() name: string;
  @ApiPropertyOptional() image: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() status: boolean;
  @ApiPropertyOptional() category_id: string;
  @ApiPropertyOptional() price: number;
}
