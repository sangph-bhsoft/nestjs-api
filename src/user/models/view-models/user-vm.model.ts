import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseModelVM } from '../../../shared/base.model';
import { UserRole } from '../user-role.enum';

export class UserVm extends BaseModelVM {
  @ApiProperty() username: string;
  @ApiPropertyOptional() firstName?: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() fullName?: string;
  @ApiPropertyOptional({ enum: UserRole })
  role?: UserRole;
}
