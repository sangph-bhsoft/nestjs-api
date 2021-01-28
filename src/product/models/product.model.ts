import { BaseModel, schemaOptions } from '../../shared/base.model';
import { ModelType, prop, Ref } from 'typegoose';
import { Category } from 'src/category/models/category.model';

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
    ref: 'Category',
  })
  category: Ref<Category>;

  @prop({
    default: true,
  })
  status?: boolean;

  @prop()
  category_name?: string;

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
