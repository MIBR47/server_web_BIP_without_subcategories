import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
// import { SubCategoryModule } from './subCategory/subCategory.module';
import { NewsModule } from './news/news.module';
import { BillboardModule } from './billboard/billboard.module';

@Module({
  imports: [CommonModule, UserModule, CategoryModule, ProductModule, NewsModule, BillboardModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
