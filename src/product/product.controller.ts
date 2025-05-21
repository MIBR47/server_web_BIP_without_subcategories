import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { CreateProductRequest, ProductDescRequest, ProductDescResponse, ProductImageRequest, ProductImageResponse, ProductResponse } from 'src/model/product.model';
import { webResponse } from 'src/model/web.model';
import * as request from 'supertest';

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

    @Post('/admin/createImageProduct')
    @HttpCode(200)
    async createImageProduct(@Auth() user: User, @Body() request: ProductImageRequest): Promise<webResponse<ProductImageResponse>> {
        const result = await this.productService.createImage(user, request);

        return {
            data: result
        };
    }

    @Get('/findall')
    async findAll(
        // @Body('category_id') category_id: number,
    ): Promise<webResponse<ProductResponse[]>> {
        const result = await this.productService.findAll();
        return {
            data: result
        }
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
