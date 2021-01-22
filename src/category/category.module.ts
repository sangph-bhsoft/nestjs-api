import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category } from './models/category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.modelName,
        schema: Category.model.schema,
      },
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
