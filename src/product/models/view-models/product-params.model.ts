import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductParams {
  @ApiPropertyOptional() keyword?: string;
  @ApiPropertyOptional() status?: boolean;
}
