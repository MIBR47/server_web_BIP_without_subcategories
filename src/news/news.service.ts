// src/module/news/news.service.ts
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateNewsRequest, UpdateNewsRequest, NewsResponse } from 'src/model/news.model';
import { ValidationService } from 'src/common/validation.service';
import { User } from '@prisma/client';
import { NewsValidation } from './news.validation';
import { Logger } from 'winston';
import { unlinkSync } from 'fs';

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

        const totalNewsWithSameSlug = await this.prismaService.news.count({
            where: {
                slug: createRequest.slug,
            },
        });

        if (totalNewsWithSameSlug !== 0) {
            throw new HttpException('news already exists', 404);
        }

        const news = await this.prismaService.news.create({
            data: {
                ...createRequest,
                createdBy: user.name,
            },
        });

        return news;
    }

    // async update(user: User, request: UpdateNewsRequest): Promise<NewsResponse> {
    //     const updateRequest: UpdateNewsRequest = this.validationService.validate(NewsValidation.UPDATE, request);

    //     const existing = await this.prismaService.news.findUnique({ where: { id: updateRequest.id } });
    //     if (!existing) throw new HttpException('News not found', 404);
    //     // const checkslug = await this.prismaService.news.findUnique({ where: { slug: updateRequest.slug } });
    //     // if (checkslug) throw new HttpException('slug already exist', 404)

    //     const result = await this.prismaService.news.update({
    //         where: { id: updateRequest.id },
    //         data: {
    //             // ...request,
    //             title: updateRequest.title,
    //             slug: updateRequest.slug,
    //             article: updateRequest.article,
    //             imageURL: updateRequest.imageURL,
    //             iShowedStatus: updateRequest.iShowedStatus,
    //             newsDate: updateRequest.newsDate,
    //             contentURL: updateRequest.contentURL,
    //             updatedBy: user.name,
    //             updatedAt: new Date(),
    //         }
    //     });

    //     return result;
    // }
    async update(
        user: User,
        request: UpdateNewsRequest,
        newImageURL: string | null,
        hasNewFile: boolean
    ): Promise<NewsResponse> {
        const newsId = Number(request.id);
        if (isNaN(newsId)) {
            throw new HttpException("ID tidak valid", 400);
        }
        const existing = await this.prismaService.news.findUnique({ where: { id: Number(request.id) } });
        if (!existing) throw new HttpException('News not found', 404);

        let imageURL = existing.imageURL;

        if (hasNewFile && newImageURL) {
            // Hapus gambar lama
            if (existing.imageURL) {
                const oldPath = `.${existing.imageURL}`;
                try {
                    unlinkSync(oldPath);
                } catch (err) {
                    console.error('Gagal menghapus gambar lama:', err);
                }
            }
            imageURL = newImageURL;
        }

        const updated = await this.prismaService.news.update({
            where: { id: Number(request.id) },
            data: {
                title: request.title,
                slug: request.slug,
                article: request.article,
                imageURL,
                iShowedStatus: request.iShowedStatus,
                newsDate: new Date(request.newsDate),
                contentURL: request.contentURL,
                updatedBy: user.name,
                updatedAt: new Date(),
            },
        });

        return updated;
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

    async findAllAdmin(page: number = 1, limit: number = 20): Promise<{ data: NewsResponse[], total: number }> {
        const skip = (page - 1) * limit;

        const [news, total] = await this.prismaService.$transaction([
            this.prismaService.news.findMany({
                // where: { iShowedStatus: 'Show' },
                skip,
                take: limit,
            }),
            this.prismaService.news.count({
                // where: { iShowedStatus: 'Show' },
            }),
        ]);

        const result = news.map((news) => ({
            ...news,
            // Tambahan mapping khusus jika perlu
        }));

        return { data: result as NewsResponse[], total };
    }

    async findAll(page: number = 1, limit: number = 20): Promise<{ data: NewsResponse[], total: number }> {
        const skip = (page - 1) * limit;

        const [news, total] = await this.prismaService.$transaction([
            this.prismaService.news.findMany({
                // where: { iShowedStatus: 'Show' },
                skip,
                take: limit,
            }),
            this.prismaService.news.count({
                // where: { iShowedStatus: 'Show' },
            }),
        ]);

        const result = news.map((news) => ({
            ...news,
            // Tambahan mapping khusus jika perlu
        }));

        return { data: result as NewsResponse[], total };
    }

    async findBySlug(slug: string): Promise<NewsResponse> {
        const result = await this.prismaService.news.findUnique({ where: { slug } });
        if (!result) throw new HttpException('News not found', 404);
        const { title, slug: resultSlug, article, imageURL, iShowedStatus, newsDate, contentURL } = result;
        return result;
    }
}
