import { BaseModel, schemaOptions } from '../../shared/base.model';
import { ModelType, prop } from 'typegoose';

export class Product extends BaseModel<Product> {
  @prop({
    required: [true, 'product name is required'],
  })
  name: string;

  @prop({
    required: [true, 'product image is required'],
  })
  image?: string;

  @prop({
    required: [true, 'product price is required'],
  })
  price: number;

  @prop()
  description?: string;

  @prop({
    required: [true, 'product category is required'],
  })
  category_id: string;

  @prop({
    default: true,
  })
  status?: boolean;

  static get model(): ModelType<Product> {
    return new Product().getModelForClass(Product, {
      schemaOptions: schemaOptions,
    });
  }

  static get modelName(): string {
    return this.model.modelName;
  }

  static createModel(): Product {
    return new this.model();
  }
}
