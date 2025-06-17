// src/module/news/news.controller.ts

import { Body, Controller, Get, Post, Patch, Delete, Param, HttpCode, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { CreateNewsRequest, UpdateNewsRequest, NewsResponse } from 'src/model/news.model';
import { webResponse, webResponseWithTotal } from 'src/model/web.model';

@Controller('/api/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Post('/admin/create')
    @HttpCode(200)
    async create(@Auth() user: User, @Body() body: CreateNewsRequest): Promise<webResponse<NewsResponse>> {
        const data = await this.newsService.create(user, body);
        return { data };
    }

    @Patch('/admin/update')
    async update(@Auth() user: User, @Body() body: UpdateNewsRequest): Promise<webResponse<NewsResponse>> {
        const data = await this.newsService.update(user, body);
        return { data };
    }

    @Delete('/admin/delete/:id')
    async delete(@Param('id') id: string): Promise<webResponse<{ message: string }>> {
        const data = await this.newsService.delete(parseInt(id));
        return { data };
    }

    // @Get('/findall')
    // async findAll(): Promise<webResponse<NewsResponse[]>> {
    //     const data = await this.newsService.findAll();
    //     return { data };
    // }
    @Get('/findall')
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ): Promise<webResponseWithTotal<NewsResponse[]>> {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const result = await this.newsService.findAll(pageNumber, limitNumber);
        return {
            data: result.data,
            total: result.total,
        };
    }

    @Get('/findbyid/:id')
    async findById(@Param('id') id: string): Promise<webResponse<NewsResponse>> {
        const data = await this.newsService.findById(parseInt(id));
        return { data };
    }
}
