import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Product } from './models/product.model';
import { ProductCreate } from './models/view-models/product-create.model';
import { ProductVm } from './models/view-models/product-vm.model';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectModel(Product.modelName)
    private readonly _productModel: ModelType<Product>,
    private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _productModel;
    this._mapper = _mapperService.mapper;
  }

  async createProduct(vm: ProductCreate): Promise<ProductVm> {
    const { name, description, status, image, category_id, price } = vm;
    const newProduct = Product.createModel();

    newProduct.name = name;
    newProduct.description = description;
    newProduct.status = status;
    newProduct.image = image;
    newProduct.category_id = category_id;
    newProduct.price = price;

    try {
      const result = await this.create(newProduct);
      return result.toJSON();
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
