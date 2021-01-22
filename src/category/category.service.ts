import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Category } from './models/category.model';
import { CategoryCreate } from './models/view-models/category-create.model';
import { CategoryVm } from './models/view-models/category-vm.model';
import { CategoryUpdate } from './models/view-models/category-update.model';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectModel(Category.modelName)
    private readonly _categoryModel: ModelType<Category>,
    private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _categoryModel;
    this._mapper = _mapperService.mapper;
  }

  async createCategory(vm: CategoryCreate): Promise<Category> {
    const { name, description, status, image } = vm;
    const newCategory = Category.createModel();

    newCategory.name = name;
    newCategory.description = description;
    newCategory.status = status;
    newCategory.image = image;

    try {
      const result = await this.create(newCategory);
      return result.toJSON();
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCategory(vm: CategoryUpdate): Promise<CategoryVm> {
    const { id, name, description, status, image } = vm;
    const category = await this.finById(id);
    if (!category) {
      throw new HttpException('category is not exists', HttpStatus.BAD_REQUEST);
    }
    category.name = name;
    category.description = description;
    category.image = image;
    category.status = status;
    try {
      const result = await this.update(id, category);
      return result.toJSON();
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
