import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
// import { SubCategoryModule } from './subCategory/subCategory.module';
import { NewsModule } from './news/news.module';
import { BillboardModule } from './billboard/billboard.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [CommonModule, UserModule, CategoryModule, ProductModule, NewsModule, BillboardModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // akses semua file di /uploads
      serveRoot: '/uploads', // maka URL-nya jadi: http://localhost:3000/uploads/namafile.jpg
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
