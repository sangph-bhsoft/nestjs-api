import { UserListVm } from './models/view-models/user-list-vm.model';
import { RolesGuard } from './../shared/guards/roles.guards';
import { JwtAuthGuard } from './../shared/guards/jwt-auth.guard';
import { UserRole } from './models/user-role.enum';
import { Roles } from './../shared/decorators/roles.decorators';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { getOperationId } from '../shared/utilities/get-operation-id';
import { User } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { UserService } from './user.service';
import { map } from 'lodash';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(getOperationId(User.modelName, 'Register'))
  async register(@Body() vm: RegisterVm): Promise<UserVm> {
    const { username, password } = vm;

    // if (!username) {
    //   throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    // }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    let exist;
    try {
      exist = await this._userService.findOne({ username });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (exist) {
      throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this._userService.register(vm);
    return this._userService.map<UserVm>(newUser);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(getOperationId(User.modelName, 'Login'))
  async login(@Body() vm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach((field) => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this._userService.login(vm);
  }
  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: UserListVm })
  @ApiOperation(getOperationId(User.modelName, 'GetListPaging'))
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  async getList(
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
    @Query('keyword') keyword?: string,
  ): Promise<UserListVm> {
    try {
      const filter = {};

      if (keyword) {
        filter['$or'] = [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
        ];
      }

      const result = await this._userService.findAllPaging(
        filter,
        page,
        pageSize,
      );
      const items = await this._userService.map<UserVm[]>(
        map(result.items, (item) => item.toJSON()),
        true,
      );
      return {
        ...result,
        items,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
