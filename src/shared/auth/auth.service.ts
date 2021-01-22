import { Configuration } from './../configuration/configuration.enum';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { UserService } from '../../user/user.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { JwtPayload } from './jwt-payload';
import { User } from '../../user/models/user.model';

@Injectable()
export class AuthService {
  private readonly JwtOption: SignOptions;
  private readonly jwtKey: string;
  constructor(
    @Inject(forwardRef(() => UserService))
    readonly _userService: UserService,
    private readonly _configurationService: ConfigurationService,
  ) {
    this.JwtOption = { expiresIn: '12h' };
    this.jwtKey = _configurationService.get(Configuration.JWT_KEY);
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return sign(payload, this.jwtKey, this.JwtOption);
  }

  async validateUser(validatePayload: JwtPayload): Promise<User> {
    return this._userService.findOne({
      username: validatePayload.username.toLowerCase(),
    });
  }
}
