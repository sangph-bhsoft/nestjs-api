import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginVm {
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
