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
import { webResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { NewsService } from './news.service';
import { CreateNewsRequest, NewsResponse } from 'src/model/news.model';

@Controller('/api/news')
export class NewsController {
    constructor(private newsService: NewsService) { }


    @Post('/admin/create')
    @HttpCode(200)
    async create(@Auth() user: User, @Body() request: CreateNewsRequest): Promise<webResponse<NewsResponse>> {
        const result = await this.newsService.create(user, request);

        return {
            data: result
        };
    }


}
