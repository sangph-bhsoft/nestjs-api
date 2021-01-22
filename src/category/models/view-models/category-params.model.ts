import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryParams {
  @ApiPropertyOptional() keyword?: string;
  @ApiPropertyOptional() status?: boolean;
}
