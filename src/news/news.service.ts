import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
// import { v4 as uuid } from 'uuid';
import { SubCategoryResponse, CreateSubCategoryRequest } from 'src/model/subcategory.model';
import { User, Category } from '@prisma/client';
import { CreateNewsRequest, NewsResponse } from 'src/model/news.model';
import { NewsValidation } from './news.validation';
import { date, datetimeRegex } from 'zod';





@Injectable()
export class NewsService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {

    }
    //create subCategory
    async create(user: User, request: CreateNewsRequest): Promise<NewsResponse> {

        this.logger.info(`create new news ${JSON.stringify(request)}`);
        // this.logger.info(request.name);
        const createRequest: CreateNewsRequest = this.validationService.validate(NewsValidation.CREATE, request);

        const news = await this.prismaService.news.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.username },
            }
        })
        var today = new Date;
        return {
            title: news.title,
            article: news.article ?? "",
            imageURL: news.imageURL ?? "",
            iShowedStatus: news.iShowedStatus,
            remarks: news.remarks ?? "",
            newsTime: news.newsTime ?? today
        }
    }
}
