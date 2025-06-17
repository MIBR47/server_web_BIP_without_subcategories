// src/module/news/news.service.ts
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateNewsRequest, UpdateNewsRequest, NewsResponse } from 'src/model/news.model';
import { ValidationService } from 'src/common/validation.service';
import { User } from '@prisma/client';
import { NewsValidation } from './news.validation';
import { Logger } from 'winston';


@Injectable()
export class NewsService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {

    }
    // async create(user: User, request: CreateNewsRequest): Promise<NewsResponse> {
    //     const createRequest: CreateNewsRequest = this.validationService.validate(NewsValidation.CREATE, request);

    //     const result = await this.prismaService.news.create({
    //         data: {
    //             ...createRequest,
    //             createdBy: user.name,
    //         }
    //     });

    //     return result;
    // }
    async create(user: User, request: CreateNewsRequest): Promise<NewsResponse> {

        const createRequest: CreateNewsRequest = this.validationService.validate(NewsValidation.CREATE, request);

        const totalNewswithSameName = await this.prismaService.news.count({
            where: {
                slug: createRequest.slug,
            }
        });

        if (totalNewswithSameName != 0) {
            throw new HttpException('news already exits', 404);
        }


        const news = await this.prismaService.news.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.name }
            }

        })

        // return {
        //     id: news.id,
        //     title: news.title,
        //     article: news.article ?? '',
        //     slug: news.slug ?? '',
        //     iShowedStatus: news.iShowedStatus,
        //     imageURL: news.imageURL ?? '',

        // }
        return news;
    }

    async update(user: User, request: UpdateNewsRequest): Promise<NewsResponse> {
        const updateRequest: UpdateNewsRequest = this.validationService.validate(NewsValidation.UPDATE, request);

        const existing = await this.prismaService.news.findUnique({ where: { id: updateRequest.id } });
        if (!existing) throw new HttpException('News not found', 404);
        // const checkslug = await this.prismaService.news.findUnique({ where: { slug: updateRequest.slug } });
        // if (checkslug) throw new HttpException('slug already exist', 404)

        const result = await this.prismaService.news.update({
            where: { id: updateRequest.id },
            data: {
                // ...request,
                title: updateRequest.title,
                slug: updateRequest.slug,
                article: updateRequest.slug,
                imageURL: updateRequest.imageURL,
                iShowedStatus: updateRequest.iShowedStatus,
                newsDate: updateRequest.newsDate,
                contentURL: updateRequest.contentURL,
                updatedBy: user.name,
                updatedAt: new Date(),
            }
        });

        return result;
    }

    async delete(id: number): Promise<{ message: string }> {
        const exists = await this.prismaService.news.findUnique({ where: { id } });
        if (!exists) throw new HttpException('News not found', 404);

        await this.prismaService.news.delete({ where: { id } });
        return { message: 'News deleted successfully' };
    }

    // async findAll(): Promise<NewsResponse[]> {
    //     return this.prismaService.news.findMany({
    //         where: { iShowedStatus: 'Show' },
    //         // orderBy: { newsDate:  }
    //     });
    // }

    async findAll(page: number = 1, limit: number = 20): Promise<{ data: NewsResponse[], total: number }> {
        const skip = (page - 1) * limit;

        const [news, total] = await this.prismaService.$transaction([
            this.prismaService.news.findMany({
                where: { iShowedStatus: 'Show' },
                skip,
                take: limit,
            }),
            this.prismaService.news.count({
                where: { iShowedStatus: 'Show' },
            }),
        ]);

        const result = news.map((news) => ({
            ...news,
            // Tambahan mapping khusus jika perlu
        }));

        return { data: result as NewsResponse[], total };
    }

    async findById(id: number): Promise<NewsResponse> {
        const result = await this.prismaService.news.findUnique({ where: { id } });
        if (!result) throw new HttpException('News not found', 404);
        return result;
    }
}
