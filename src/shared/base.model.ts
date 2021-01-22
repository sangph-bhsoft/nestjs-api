import { SchemaOptions } from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Typegoose, prop } from 'typegoose';

export abstract class BaseModel<T> extends Typegoose {
  @prop({ default: Date.now() })
  createdAt?: Date;

  @prop({ default: Date.now() })
  updatedAt?: Date;

  id?: string;
}

export class BaseModelVM {
  createdAt?: Date;

  updatedAt?: Date;

  @ApiPropertyOptional() id?: string;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
};

export abstract class Pagination<T> {
  page: number;
  pageSize: number;
  items: T[];
  totalPage: number;
  itemsCount: number;
}
