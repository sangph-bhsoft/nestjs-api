import { UserRole } from './../user/models/user-role.enum';
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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { CategoryVm } from './models/view-models/category-vm.model';
import { map } from 'lodash';
import { CategoryUpdate } from './models/view-models/category-update.model';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { Roles } from '../shared/decorators/roles.decorators';

const storage = {
  storage: diskStorage({
    destination: './uploads/images/category',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('category')
@ApiBearerAuth()
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

  @Get(':id')
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'GetAll'))
  async getById(@Param('id') id: string): Promise<CategoryVm> {
    try {
      const category = await this._categoryService.finById(id);
      return this._categoryService.map<CategoryVm>(category.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, UseGuards)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'Create'))
  @UseInterceptors(FileInterceptor('image', storage))
  @ApiConsumes('multipart/form-data')
  async createCategory(
    @Body() category: CategoryCreate,
    @UploadedFile() image,
  ): Promise<CategoryVm> {
    category.image = `category/image/${image.filename}`;
    const newCategory = await this._categoryService.createCategory(category);
    return this._categoryService.map<CategoryVm>(newCategory);
  }

  @Put()
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, UseGuards)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'Update'))
  @UseInterceptors(FileInterceptor('image', storage))
  @ApiConsumes('multipart/form-data')
  async updateCategory(
    @Body() category: CategoryUpdate,
    @UploadedFile() image,
  ): Promise<CategoryVm> {
    category.image = `category/image/${image.filename}`;
    const newCategory = await this._categoryService.updateCategory(category);
    return this._categoryService.map<CategoryVm>(newCategory);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, UseGuards)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: CategoryVm })
  @ApiOperation(getOperationId(Category.modelName, 'Delete'))
  async deleteCategory(@Param('id') id: string): Promise<CategoryVm> {
    try {
      const deleted = await this._categoryService.delete(id);
      return this._categoryService.map<CategoryVm>(deleted.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('image/:image')
  async findImage(@Param('image') image, @Res() res): Promise<any> {
    res.sendFile(image, { root: 'uploads/images/category/' });
  }
}
