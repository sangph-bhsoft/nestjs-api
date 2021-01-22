import 'automapper-ts/dist/automapper';
import { CreateQuery, Types, UpdateQuery } from 'mongoose';
import { Typegoose, ModelType, InstanceType } from 'typegoose';
import { Pagination } from './base.model';

export class BaseService<T extends Typegoose> {
  protected _model: ModelType<T>;
  protected _mapper: AutoMapperJs.AutoMapper;

  private get modelName(): string {
    return this._model.modelName;
  }

  private get viewModelName(): string {
    return `${this._model.modelName}Vm`;
  }

  async map<K>(
    object: Partial<InstanceType<T>> | Partial<InstanceType<T>>[],
    isArray = false,
    sourceKey?: string,
    destinationKey?: string,
  ): Promise<K> {
    const _sourceKey = isArray
      ? `${sourceKey || this.modelName}[]`
      : sourceKey || this.modelName;

    const _destinationKey = isArray
      ? `${destinationKey || this.viewModelName}[]`
      : destinationKey || this.viewModelName;

    return this._mapper.map(_sourceKey, _destinationKey, object);
  }

  private toObjectId(id: string): Types.ObjectId {
    return Types.ObjectId(id);
  }

  async findAll(filter = {}): Promise<InstanceType<T>[]> {
    return this._model.find(filter).exec();
  }

  async findAllPaging(
    filter = {},
    page = 1,
    pageSize = 2,
  ): Promise<Pagination<InstanceType<T>>> {
    const query = this._model
      .find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const items = await query;
    const itemsCount = await query.count();
    const count = await this._model.count(filter);
    const totalPage = Math.round(count / pageSize);
    return {
      page,
      pageSize,
      items,
      totalPage,
      itemsCount,
    };
  }

  async findOne(filter = {}): Promise<InstanceType<T>> {
    return this._model.findOne(filter).exec();
  }

  async finById(id: string): Promise<InstanceType<T>> {
    return this._model.findById(this.toObjectId(id)).exec();
  }

  async create(item: CreateQuery<InstanceType<T>>): Promise<InstanceType<T>> {
    return this._model.create(item);
  }

  async update(
    id: string,
    item: UpdateQuery<InstanceType<T>>,
  ): Promise<InstanceType<T>> {
    return this._model
      .findByIdAndUpdate(this.toObjectId(id), item, { new: true })
      .exec();
  }

  async delete(id: string): Promise<InstanceType<T>> {
    return this._model.findByIdAndRemove(this.toObjectId(id)).exec();
  }
}
