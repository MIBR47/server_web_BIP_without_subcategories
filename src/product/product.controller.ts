import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { CreateProductRequest, ProductDescRequest, ProductDescResponse, ProductImageRequest, ProductImageResponse, ProductResponse } from 'src/model/product.model';
import { webResponse, webResponseWithTotal } from 'src/model/web.model';
import * as request from 'supertest';
import { UpdateCategoryRequest } from 'src/model/category.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/product')
export class ProductController {
    constructor(private productService: ProductService) { }


    @Post('/admin/create')
    @HttpCode(200)
    async create(@Auth() user: User, @Body() request: CreateProductRequest): Promise<webResponse<ProductResponse>> {
        const result = await this.productService.create(user, request);

        return {
            data: result
        };
    }

    @Post('/admin/createDescProduct')
    @HttpCode(200)
    async createDescProduct(@Auth() user: User, @Body() request: ProductDescRequest): Promise<webResponse<ProductDescResponse>> {
        const result = await this.productService.createDesc(user, request);

        return {
            data: result
        };
    }

    // @Post('/admin/createImageProduct')
    // @HttpCode(200)
    // async createImageProduct(@Auth() user: User, @Body() request: ProductImageRequest): Promise<webResponse<ProductImageResponse>> {
    //     const result = await this.productService.createImage(user, request);

    //     return {
    //         data: result
    //     };
    // }

    @Post('/admin/createImageProduct')
    @HttpCode(200)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/images', // simpan di folder lokal
                filename: (req, file, cb) => {
                    const filename = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, filename);
                },
            }),
        }),
    )
    async createImageProduct(
        @Auth() user: User,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        const imageURL = `/uploads/images/${file.filename}`; // atau bisa berupa path absolut di server
        const request = {
            iStatus: body.iStatus,
            product_id: parseInt(body.product_id),
            isPrimary: body.isPrimary === 'true',
            imageURL,
        };

        const result = await this.productService.createImage(user, request);

        return {
            data: result,
        };
    }

    @Patch('/admin/update')
    @HttpCode(200)
    async updateProduct(@Auth() user: User, @Body() request: UpdateCategoryRequest): Promise<webResponse<ProductResponse>> {
        const result = await this.productService.update(user, request);
        return { data: result };
    }

    @Patch('/admin/updateDescProduct')
    @HttpCode(200)
    async updateDescProduct(@Auth() user: User, @Body() request: ProductDescRequest): Promise<webResponse<ProductDescResponse>> {
        const result = await this.productService.updateDesc(user, request);
        return { data: result };
    }

    @Patch('/admin/updateImageProduct')
    @HttpCode(200)
    async updateImageProduct(@Auth() user: User, @Body() request: ProductImageRequest): Promise<webResponse<ProductImageResponse>> {
        const result = await this.productService.updateImage(user, request);
        return { data: result };
    }


    @Get('/admin/findall')
    async findAllAdmin(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ): Promise<webResponseWithTotal<ProductResponse[]>> {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const result = await this.productService.findAll(pageNumber, limitNumber);
        return {
            data: result.data,
            total: result.total,
        };
    }

    @Get('/findall')
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ): Promise<webResponseWithTotal<ProductResponse[]>> {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const result = await this.productService.findAll(pageNumber, limitNumber);
        return {
            data: result.data,
            total: result.total,
        };
    }


    @Get('/findbyid/:category_id')
    async findByCategoryID(
        @Param('category_id') category_id: string,
    ): Promise<webResponse<ProductResponse[]>> {
        const parseCategory_id = parseInt(category_id);
        const result = await this.productService.findbyCategoryId(parseCategory_id);
        return {
            data: result
        }
    }

    @Get('/findbyslug/:slug')
    async findBySlug(
        @Param('slug') slug: string,
    ): Promise<webResponse<ProductResponse>> {
        const result = await this.productService.findbyslug(slug);
        return {
            data: result
        }
    }

    @Get('/findbyname/:name')
    async findByName(
        @Param('name') name: string,
    ): Promise<webResponse<ProductResponse[]>> {
        const result = await this.productService.findbyname(name);
        return {
            data: result
        }
    }



}
