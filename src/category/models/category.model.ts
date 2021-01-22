import { BaseModel, schemaOptions } from '../../shared/base.model';
import { ModelType, prop, Ref } from 'typegoose';
import { Product } from '../../product/models/product.model';

export class Category extends BaseModel<Category> {
  @prop({ ref: 'Product' })
  public products?: Ref<Product>[];

  @prop({
    required: [true, 'category name is required'],
    unique: true,
  })
  name: string;

  @prop({
    required: [true, 'category image is required'],
  })
  image?: string;

  @prop()
  description?: string;

  @prop({
    default: true,
  })
  status?: boolean;

  static get model(): ModelType<Category> {
    return new Category().getModelForClass(Category, {
      schemaOptions: schemaOptions,
    });
  }

  static get modelName(): string {
    return this.model.modelName;
  }

  static createModel(): Category {
    return new this.model();
  }
}
