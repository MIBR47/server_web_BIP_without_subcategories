import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
// import { RegisterUserRequestModel, UserResponseModel } from 'src/model/user.model';
// import { UserValidation } from 'src/user/user.validation';
// import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
// import { v4 as uuid } from 'uuid';
import { CategoryValidation } from './category.validation';
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from 'src/model/category.model';
import { User } from '@prisma/client';
import { unlinkSync } from 'fs';


@Injectable()
export class CategoryService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {

    }
    //create category
    async create(user: User, request: CreateCategoryRequest): Promise<CategoryResponse> {

        this.logger.info(`create new category ${JSON.stringify(request)}`);

        const createRequest: CreateCategoryRequest = this.validationService.validate(CategoryValidation.CREATE, request);

        const totalCategorywithSameName = await this.prismaService.category.count({
            where: {
                slug: createRequest.slug,
            }
        });

        if (totalCategorywithSameName != 0) {
            throw new HttpException('category already exits', 404);
        }

        const category = await this.prismaService.category.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.name }
            }

        })

        return {
            name: category.name,
            slug: category.slug ?? '',
            remarks: category.remarks ?? '',
            // iStatus: category.iStatus,
            iShowedStatus: category.iShowedStatus,
            imageURL: category.imageURL,
        }
    }

    async findAllAdmin(
        // category_id: number,
    ): Promise<CategoryResponse[]> {
        const Categories = await this.prismaService.category.findMany({
            // where: { iShowedStatus: 'Show' },
        });

        const allCategory = Categories.map((category) => {
            // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
            // const primaryImageURL =
            //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
            return {
                ...category,
                createdBy: category.createdBy.trim()
                // id: subcategory.id,
                // name: subcategory.name.trim(),
                // slug: subcategory.slug?.trim(),
                // catalog_id: product.catalog_id?.trim(),
                // register_id: product.register_id?.trim(),
                // category_id: subcategory.category_id,
                // subCategory_id: product.subCategory_id.trim(),
                // brand_id: product.brand_id.trim(),
                // uom_id: product.uom_id?.trim(),
                // primaryImageURL,
            };
        });

        return allCategory as CategoryResponse[];
    }

    async findAll(
        // category_id: number,
    ): Promise<CategoryResponse[]> {
        const Categories = await this.prismaService.category.findMany({
            where: { iShowedStatus: 'Show' },
        });

        const allCategory = Categories.map((category) => {
            // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
            // const primaryImageURL =
            //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
            return {
                ...category,
                createdBy: category.createdBy.trim()
                // id: subcategory.id,
                // name: subcategory.name.trim(),
                // slug: subcategory.slug?.trim(),
                // catalog_id: product.catalog_id?.trim(),
                // register_id: product.register_id?.trim(),
                // category_id: subcategory.category_id,
                // subCategory_id: product.subCategory_id.trim(),
                // brand_id: product.brand_id.trim(),
                // uom_id: product.uom_id?.trim(),
                // primaryImageURL,
            };
        });

        return allCategory as CategoryResponse[];
    }

    async findByslug(
        slug: string,
    ): Promise<CategoryResponse> {
        const Categories = await this.prismaService.category.findUnique({
            where: { slug },
        });

        // const allCategory = Categories.map((category) => {
        //     // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
        //     // const primaryImageURL =
        //     //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
        //     return {
        //         ...category,
        //         createdBy: category.createdBy.trim()
        //         // id: subcategory.id,
        //         // name: subcategory.name.trim(),
        //         // slug: subcategory.slug?.trim(),
        //         // catalog_id: product.catalog_id?.trim(),
        //         // register_id: product.register_id?.trim(),
        //         // category_id: subcategory.category_id,
        //         // subCategory_id: product.subCategory_id.trim(),
        //         // brand_id: product.brand_id.trim(),
        //         // uom_id: product.uom_id?.trim(),
        //         // primaryImageURL,
        //     };
        // });

        return Categories as CategoryResponse;
    }

    async findById(
        id: number,
    ): Promise<CategoryResponse> {
        const Categories = await this.prismaService.category.findUnique({
            where: { id },
        })

        return Categories as CategoryResponse;
    }

    async delete(user: User, id: number): Promise<void> {
        const existing = await this.prismaService.category.findUnique({
            where: { id }
        });

        if (!existing) {
            throw new HttpException('Category not found', 404);
        }
        // Cek apakah masih ada produk yang pakai kategori ini
        const productCount = await this.prismaService.product.count({
            where: { category_id: id },
        });

        if (productCount > 0) {
            throw new HttpException('Category masih digunakan oleh produk', HttpStatus.BAD_REQUEST);
        }
        // Jika aman, hapus kategori
        await this.prismaService.category.delete({
            where: { id }
        });

        this.logger.info(`Category with id ${id} deleted by ${user.name}`);
    }

    // async update(user: User, id: number, request: CreateCategoryRequest): Promise<CategoryResponse> {
    //     const existing = await this.prismaService.category.findUnique({
    //         where: { id }
    //     });

    //     if (!existing) {
    //         throw new HttpException('Category not found', 404);
    //     }

    //     const updateRequest: CreateCategoryRequest = this.validationService.validate(CategoryValidation.CREATE, request);

    //     const updated = await this.prismaService.category.update({
    //         where: { id },
    //         data: {
    //             ...updateRequest,
    //             updatedBy: user.name
    //         }
    //     });

    //     return {
    //         name: updated.name,
    //         slug: updated.slug ?? '',
    //         remarks: updated.remarks ?? '',
    //         iStatus: updated.iStatus,
    //         iShowedStatus: updated.iShowedStatus,
    //         imageURL: updated.imageURL ?? ''
    //     };
    // }
    // async   update(user: User, request: UpdateCategoryRequest): Promise<CategoryResponse> {
    //     const existing = await this.prismaService.category.findUnique({
    //         where: { id: request.id },
    //     });

    //     if (!existing) {
    //         throw new HttpException('Category not found', 404);
    //     }

    //     const updated = await this.prismaService.category.update({
    //         where: { id: request.id },
    //         data: {
    //             name: request.name,
    //             slug: request.slug,
    //             remarks: request.remarks,
    //             // iStatus: request.iStatus,
    //             iShowedStatus: request.iShowedStatus,
    //             imageURL: request.imageURL,
    //             updatedBy: user.name,
    //             updatedAt: new Date(),
    //         },
    //     });

    //     return {
    //         // id: updated.id,
    //         name: updated.name,
    //         slug: updated.slug ?? '',
    //         remarks: updated.remarks ?? '',
    //         // iStatus: updated.iStatus,
    //         iShowedStatus: updated.iShowedStatus,
    //         imageURL: updated.imageURL ?? '',
    //     };
    // }

    async update(
        user: User,
        request: UpdateCategoryRequest,
        newImageURL: string | null,
        hasNewFile: boolean
    ): Promise<CategoryResponse> {
        const categoryId = Number(request.id);
        if (isNaN(categoryId)) {
            throw new HttpException('ID tidak valid', 400);
        }

        const existing = await this.prismaService.category.findUnique({
            where: { id: categoryId },
        });

        if (!existing) {
            throw new HttpException('Category not found', 404);
        }

        let imageURL = existing.imageURL;

        if (hasNewFile && newImageURL) {
            // Hapus gambar lama jika ada
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

        const updated = await this.prismaService.category.update({
            where: { id: categoryId },
            data: {
                name: request.name,
                slug: request.slug,
                remarks: request.remarks,
                iShowedStatus: request.iShowedStatus,
                imageURL,
                updatedBy: user.name,
                updatedAt: new Date(),
            },
        });

        return {
            name: updated.name,
            slug: updated.slug ?? '',
            remarks: updated.remarks ?? '',
            iShowedStatus: updated.iShowedStatus,
            imageURL: updated.imageURL ?? '',
        };
    }



}
