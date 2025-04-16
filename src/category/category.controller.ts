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
import { CategoryService } from './category.service';
import { CategoryResponse, CreateCategoryRequest } from 'src/model/category.model';
import { webResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }


    @Post('/admin/create')
    @HttpCode(200)
    async create(@Auth() user: User, @Body() request: CreateCategoryRequest): Promise<webResponse<CategoryResponse>> {
        const result = await this.categoryService.create(user, request);

        return {
            data: result
        };
    }

    @Get('/findall')
    async findAll(
        // @Body('category_id') category_id: number,
    ): Promise<webResponse<CategoryResponse[]>> {
        const result = await this.categoryService.findAll();
        return {
            data: result
        }
    }

    @Get('/findbyslug/:slug')
    async findBySlug(
        @Param('slug') slug: string,
    ): Promise<webResponse<CategoryResponse>> {
        const result = await this.categoryService.findByslug(slug);
        return {
            data: result
        }
    }


}
