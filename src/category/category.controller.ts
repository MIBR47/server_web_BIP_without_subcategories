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

    @Delete('/admin/delete/:id')
    @HttpCode(200)
    async delete(
        @Auth() user: User,
        @Param('id') id: string
    ): Promise<webResponse<string>> {
        const parseId = parseInt(id);
        await this.categoryService.delete(user, parseId);
        return { data: 'Category deleted successfully' };
    }

    @Patch('/admin/update/:id')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('id') id: string,
        @Body() request: CreateCategoryRequest
    ): Promise<webResponse<CategoryResponse>> {
        const parseId = parseInt(id);
        const result = await this.categoryService.update(user, parseId, request);
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

    @Get('/findbyid/:id')
    async findByID(
        @Param('id') id: string,
    ): Promise<webResponse<CategoryResponse>> {
        const parseId = parseInt(id);
        const result = await this.categoryService.findById(parseId);
        return {
            data: result
        }
    }




}
