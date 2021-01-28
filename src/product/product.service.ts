import { ProductUpdate } from './models/view-models/product-update.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Product } from './models/product.model';
import { ProductCreate } from './models/view-models/product-create.model';
import { ProductVm } from './models/view-models/product-vm.model';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectModel(Product.modelName)
    private readonly _productModel: ModelType<Product>,
    private readonly _mapperService: MapperService,
    private readonly _categoryService: CategoryService,
  ) {
    super();
    this._model = _productModel;
    this._mapper = _mapperService.mapper;
  }

  async createProduct(vm: ProductCreate): Promise<Product> {
    const { name, description, status, image, category_id, price } = vm;
    const newProduct = Product.createModel();
    const category = await this._categoryService.finById(category_id);

    if (!category)
      throw new HttpException(
        'Can not find category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    newProduct.name = name;
    newProduct.description = description;
    newProduct.status = status;
    newProduct.image = image;
    newProduct.category = category;
    newProduct.price = price;
    newProduct.category_name = category.name;

    try {
      const result = await this.create(newProduct);
      return result.toJSON();
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProduct(vm: ProductUpdate): Promise<Product> {
    const { id, name, description, status, image, price, category_id } = vm;
    const product = await this.finById(id);
    if (!product) {
      throw new HttpException('product is not exists', HttpStatus.BAD_REQUEST);
    }

    const category = await this._categoryService.finById(category_id);

    if (!category)
      throw new HttpException(
        'Can not find category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    product.name = name;
    product.description = description;
    product.image = image;
    product.status = status;
    product.price = price;
    product.category = category;
    product.category_name = category.name;
    try {
      const result = await this.update(id, product);
      return result.toJSON();
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
