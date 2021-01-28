import { ProductUpdate } from './models/view-models/product-update.model';
import { UserRole } from '../user/models/user-role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { getOperationId } from '../shared/utilities/get-operation-id';
import { ProductService } from './product.service';
import { Product } from './models/product.model';
import { ProductCreate } from './models/view-models/product-create.model';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { ProductVm } from './models/view-models/product-vm.model';
import { ProductListVm } from './models/view-models/product-list-vm.model';
import { map } from 'lodash';
import { Roles } from '../shared/decorators/roles.decorators';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guards';

const storage = {
  storage: diskStorage({
    destination: './uploads/images/product',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('product')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: ProductCreate })
  @ApiOperation(getOperationId(Product.modelName, 'Create'))
  @UseInterceptors(FileInterceptor('image', storage))
  @ApiConsumes('multipart/form-data')
  async createProduct(@Body() product: ProductCreate, @UploadedFile() image) {
    product.image = `product/image/${image.filename}`;
    const newProduct = await this._productService.createProduct(product);
    return this._productService.map<ProductVm>(newProduct);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: ProductListVm })
  @ApiOperation(getOperationId(Product.modelName, 'GetList'))
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  async getList(
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
    @Query('keyword') keyword?: string,
  ): Promise<ProductListVm> {
    try {
      const filter = {};

      if (keyword) {
        filter['$or'] = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ];
      }

      const result = await this._productService.findAllPaging(
        filter,
        page,
        pageSize,
      );
      const items = await this._productService.map<ProductVm[]>(
        map(result.items, (item) => item.toJSON()),
        true,
      );
      return {
        ...result,
        items,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: ProductVm })
  @ApiOperation(getOperationId(Product.modelName, 'GetById'))
  async getById(@Param('id') id: string): Promise<ProductVm> {
    try {
      const product = await this._productService.finById(id);
      return this._productService.map<ProductVm>(product.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, UseGuards)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(getOperationId(Product.modelName, 'Create'))
  @UseInterceptors(FileInterceptor('image', storage))
  @ApiConsumes('multipart/form-data')
  async updateProduct(
    @Body() product: ProductUpdate,
    @UploadedFile() image,
  ): Promise<ProductVm> {
    product.image = `product/image/${image.filename}`;
    const newProduct = await this._productService.updateProduct(product);
    return this._productService.map<ProductVm>(newProduct);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, UseGuards)
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOkResponse({ type: ProductVm })
  @ApiOperation(getOperationId(Product.modelName, 'Delete'))
  async deleteCategory(@Param() id: string): Promise<ProductVm> {
    try {
      const deleted = await this._productService.delete(id);
      return this._productService.map<ProductVm>(deleted.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('image/:image')
  async findImage(@Param('image') image, @Res() res): Promise<any> {
    res.sendFile(image, { root: 'uploads/images/product/' });
  }
}
