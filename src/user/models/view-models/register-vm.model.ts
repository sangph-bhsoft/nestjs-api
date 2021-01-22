import { ApiPropertyOptional } from '@nestjs/swagger';

import { LoginVm } from './login-vm.model';

export class RegisterVm extends LoginVm {
  @ApiPropertyOptional() firstName?: string;
  @ApiPropertyOptional() lastName?: string;
}
