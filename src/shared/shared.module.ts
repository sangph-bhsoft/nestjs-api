import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { AuthService } from './auth/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt-strategy.service';

@Global()
@Module({
  providers: [ConfigurationService, MapperService, AuthService, JwtStrategy],
  exports: [ConfigurationService, MapperService, AuthService],
  imports: [UserModule],
})
export class SharedModule {}
