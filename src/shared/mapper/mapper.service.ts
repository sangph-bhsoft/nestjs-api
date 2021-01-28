import 'automapper-ts/dist/automapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {
  mapper: AutoMapperJs.AutoMapper;

  constructor() {
    this.mapper = automapper;
    this.initializeMapper();
  }

  private initializeMapper(): void {
    this.mapper.initialize(MapperService.configure);
  }

  static configure(config: AutoMapperJs.IConfiguration): void {
    config
      .createMap('User', 'UserVm')
      .forSourceMember('_id', (opts) => opts.ignore())
      .forSourceMember('password', (opts) => opts.ignore());

    config
      .createMap('User[]', 'UserVm[]')
      .forSourceMember('_id', (opts) => opts.ignore())
      .forSourceMember('password', (opts) => opts.ignore());
    config
      .createMap('Category', 'CategoryVm')
      .forSourceMember('_id', (opts) => opts.ignore());

    config
      .createMap('Category[]', 'CategoryVm[]')
      .forSourceMember('_id', (opts) => opts.ignore());
    config
      .createMap('Product', 'ProductVm')
      .forSourceMember('_id', (opts) => opts.ignore());

    config
      .createMap('Product[]', 'ProductVm[]')
      .forSourceMember('_id', (opts) => opts.ignore());
  }
}
