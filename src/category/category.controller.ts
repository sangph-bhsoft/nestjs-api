import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { getOperationId } from '../shared/utilities/get-operation-id';
import { CategoryService } from './category.service';
import { Category } from './models/category.model';
import { CategoryCreate } from './models/view-models/category-create.model';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CategoryVm } from './models/view-models/category-vm.model';
import { map } from 'lodash';
import { CategoryUpdate } from './models/view-models/category-update.model';

const config = diskStorage({
  destination: './uploads/images/category',
  filename: (req, file, cb) => {
    // Generating a 32 random chars long string
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    //Calling the callback passing the random name generated with the original extension name
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@Controller('category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: CategoryVm, isArray: true })
  @ApiOperation(getOperationId(Category.modelName, 'GetAll'))
  async getList(): Promise<CategoryVm[]> {
    try {
      const categories = await this._categoryService.findAll();
      return this._categoryService.map<CategoryVm[]>(
        map(categories, (cat) => cat.toJSON()),
        true,
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'Create'))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: config,
    }),
  )
  @ApiConsumes('multipart/form-data')
  async createCategory(
    @Body() category: CategoryCreate,
    @UploadedFile() image,
  ): Promise<CategoryVm> {
    category.image = image.path;
    const newCategory = await this._categoryService.createCategory(category);
    return this._categoryService.map<CategoryVm>(newCategory);
  }

  @Put()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'Update'))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: config,
    }),
  )
  @ApiConsumes('multipart/form-data')
  async updateCategory(
    @Body() category: CategoryUpdate,
    @UploadedFile() image,
  ): Promise<CategoryVm> {
    category.image = image.path;
    const newCategory = await this._categoryService.updateCategory(category);
    return this._categoryService.map<CategoryVm>(newCategory);
  }

  @Delete(':id')
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'Delete'))
  async deleteCategory(@Param() id: string): Promise<CategoryVm> {
    try {
      const deleted = await this._categoryService.delete(id);
      return this._categoryService.map<CategoryVm>(deleted.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
