import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { getOperationId } from '../shared/utilities/get-operation-id';
import { ProductService } from './product.service';
import { Product } from './models/product.model';
import { ProductCreate } from './models/view-models/product-create.model';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductVm } from './models/view-models/product-vm.model';
import { ProductListVm } from './models/view-models/product-list-vm.model';
import { getMaxListeners } from 'process';
import { map } from 'lodash';

@Controller('product')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Post()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiCreatedResponse({ type: ProductCreate })
  @ApiOperation(getOperationId(Product.modelName, 'Create'))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images/product',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async createProduct(@Body() product: ProductCreate, @UploadedFile() image) {
    product.image = image.path;
    const newProduct = await this._productService.createProduct(product);
    return this._productService.map<ProductVm>(newProduct);
  }

  @Get()
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
      const filter = {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      };

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
}
