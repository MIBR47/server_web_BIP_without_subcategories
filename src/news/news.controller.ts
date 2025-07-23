// src/module/news/news.controller.ts

import { Body, Controller, Get, Post, Patch, Delete, Param, HttpCode, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { NewsService } from './news.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { CreateNewsRequest, UpdateNewsRequest, NewsResponse } from 'src/model/news.model';
import { webResponse, webResponseWithTotal } from 'src/model/web.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('/api/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    // @Post('/admin/create')
    // @HttpCode(200)
    // async create(@Auth() user: User, @Body() body: CreateNewsRequest): Promise<webResponse<NewsResponse>> {
    //     const data = await this.newsService.create(user, body);
    //     return { data };
    // }
    @Post('/admin/create')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/news', // atau path lain sesuai kebutuhanmu
            filename: (req, file, cb) => {
                const uniqueSuffix = uuidv4() + extname(file.originalname);
                cb(null, uniqueSuffix);
            },
        }),
    }))
    async create(
        @Auth() user: User,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ): Promise<webResponse<NewsResponse>> {
        const imageURL = file ? `/uploads/news/${file.filename}` : null;

        const data = await this.newsService.create(user, { ...body, imageURL });

        return { data };
    }

    @Patch('/admin/update')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/news',
            filename: (req, file, cb) => {
                const uniqueSuffix = uuidv4() + extname(file.originalname);
                cb(null, uniqueSuffix);
            },
        }),
    }))
    async update(
        @Auth() user: User,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
    ): Promise<webResponse<NewsResponse>> {

        // Ambil URL baru jika ada file
        const imageURL = file ? `/uploads/news/${file.filename}` : body.imageURL || null;

        const data = await this.newsService.update(user, body, imageURL, !!file);
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
    @Get('/admin/findall')
    async findAllAdmin(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
    ): Promise<webResponseWithTotal<NewsResponse[]>> {
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        const result = await this.newsService.findAllAdmin(pageNumber, limitNumber);
        return {
            data: result.data,
            total: result.total,
        };
    }

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

    @Get('/findbyslug/:slug')
    async findById(@Param('slug') slug: string): Promise<webResponse<NewsResponse>> {
        const data = await this.newsService.findBySlug(slug);
        return { data };
    }
}
