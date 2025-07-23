import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User, ProductImage } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreateProductRequest, ProductDescRequest, ProductDescResponse, ProductImageRequest, ProductImageResponse, ProductResponse, UpdateProductImageRequest } from 'src/model/product.model';
import { Logger } from 'winston';
import { ProductDescValidation, ProductImageValidation, ProductValidation } from './product.validation';
import * as request from 'supertest';
import { UpdateCategoryRequest } from 'src/model/category.model';

import { unlinkSync } from 'fs';
import { join } from 'path';



@Injectable()
export class ProductService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {

    }
    //create product
    async create(
        user: User,
        request: CreateProductRequest,
        // requestDesc: ProductDescRequest,
        // requestImage: ProductImageRequest
    ): Promise<ProductResponse> {

        this.logger.info(`create new product ${JSON.stringify(request)}`);
        // this.logger.info(request.name);

        // const requestDesc: ProductDescRequest = request.ProductDesc ;

        const createRequest: CreateProductRequest = this.validationService.validate(ProductValidation.CREATE, request);

        const totalproductwithSameName = await this.prismaService.product.count({
            where: {
                slug: createRequest.slug,
            }
        });

        if (totalproductwithSameName != 0) {
            throw new HttpException('product already exits', 409);
        }

        const product = await this.prismaService.product.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.name },
            }

        })



        return {
            id: product.id,
            catalog_id: product.catalog_id?.trim() ?? "",
            name: product.name,
            slug: product.slug ?? '',
            // remarks: product.remarks ?? '',
            // iStatus: product.iStatus,
            iShowedStatus: product.iShowedStatus,
            category_id: product.category_id,
            eCatalogURL: product.eCatalogURL
        }
    }

    async createDesc(user: User, request: ProductDescRequest): Promise<ProductDescResponse> {
        this.logger.info(`create new desc product ${JSON.stringify(request)}`);
        const createRequest: ProductDescRequest = this.validationService.validate(ProductDescValidation.CREATE, request);

        const productDesc = await this.prismaService.productDesc.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.name },
            }
        })

        const checkProductID = await this.prismaService.product.findFirst({
            where: {
                id: createRequest.product_id,
            }
        });

        if (!checkProductID) {
            throw new HttpException('product not exist', 401);
        }



        return {
            other_info: productDesc.other_info ?? "",
            productSpec: productDesc.productSpec ?? "",
            // benefits: productDesc.benefits ?? "",
            product_id: productDesc.product_id
        }

    }

    async createImage(user: User, request: ProductImageRequest): Promise<ProductImageResponse> {
        this.logger.info(`create new image product ${JSON.stringify(request)}`);
        const createRequest: ProductImageRequest = this.validationService.validate(ProductImageValidation.CREATE, request);

        const productImage = await this.prismaService.productImage.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.name },
            }
        })

        const checkProductID = await this.prismaService.product.findFirst({
            where: {
                id: createRequest.product_id,
            }
        });

        if (!checkProductID) {
            throw new HttpException('product not exist', 401);
        }

        return {
            imageURL: productImage.imageURL,
            product_id: productImage.product_id,
            isPrimary: productImage.isPrimary,
            iStatus: productImage.iStatus,
            // createdBy: productImage.createdBy;
            // product_id: productDesc.product_id
        }

    }

    async update(user: User, request: UpdateCategoryRequest): Promise<ProductResponse> {
        const updateRequest: UpdateCategoryRequest = this.validationService.validate(ProductValidation.UPDATE, request);

        const existingProduct = await this.prismaService.product.findFirst({
            where: { id: updateRequest.id },
        });

        if (!existingProduct) {
            throw new HttpException('product not found', 404);
        }

        const updated = await this.prismaService.product.update({
            where: { id: updateRequest.id },
            data: {
                ...updateRequest,
                updatedBy: user.name,
            },
        });

        return {
            ...updated,
            slug: updated.slug ?? "",
            catalog_id: updated.catalog_id?.trim() ?? "",
            eCatalogURL: updated.eCatalogURL ?? "",
        };
    }

    async updateDesc(user: User, request: ProductDescRequest): Promise<ProductDescResponse> {
        const updateRequest = this.validationService.validate(ProductDescValidation.UPDATE, request);

        const existingDesc = await this.prismaService.productDesc.findFirst({
            where: { id: updateRequest.id },
        });

        if (!existingDesc) {
            throw new HttpException('description not found', 404);
        }

        const updated = await this.prismaService.productDesc.update({
            where: { id: existingDesc.id },
            data: {
                ...updateRequest,
                updatedBy: user.name,
            },
        });

        return {
            other_info: updated.other_info ?? "",
            productSpec: updated.productSpec ?? "",
            product_id: updated.product_id,
        };
    }

    async updateImage(user: User, request: UpdateProductImageRequest, id: number): Promise<ProductImageResponse> {
        const updateRequest = this.validationService.validate(ProductImageValidation.UPDATE, request);

        const existingImage = await this.prismaService.productImage.findFirst({
            where: { id: updateRequest.id },
        });

        if (!existingImage) {
            throw new HttpException('image not found', 404);
        }

        const updated = await this.prismaService.productImage.update({
            where: { id: id },
            data: {
                ...updateRequest,
                updatedBy: user.name,
            },
        });

        return {
            imageURL: updated.imageURL,
            product_id: updated.product_id,
            isPrimary: updated.isPrimary,
            iStatus: updated.iStatus,
        };
    }

    async delete(user: User, id: number): Promise<void> {
        const existing = await this.prismaService.productImage.findUnique({
            where: { id }
        });

        if (!existing) {
            throw new HttpException('product image not found', 404);
        }
        // // Cek apakah masih ada produk yang pakai kategori ini
        // const productCount = await this.prismaService.product.count({
        //     where: { category_id: id },
        // });

        // if (productCount > 0) {
        //     throw new HttpException('Category masih digunakan oleh produk', HttpStatus.BAD_REQUEST);
        // }
        // Jika aman, hapus kategori
        await this.prismaService.productImage.delete({
            where: { id }
        });

        this.logger.info(`produt image with id ${id} deleted by ${user.name}`);
    }


    // async updateImage(
    //     user: User,
    //     request: ProductImageRequest,
    //     newImageURL: string | null,
    //     hasNewFile: boolean
    // ): Promise<ProductImageResponse> {
    //     const updateRequest = this.validationService.validate(ProductImageValidation.UPDATE, request);

    //     const imageId = Number(updateRequest.id);
    //     if (isNaN(imageId)) {
    //         throw new HttpException("ID tidak valid", 400);
    //     }

    //     const existingImage = await this.prismaService.productImage.findUnique({
    //         where: { id: imageId },
    //     });

    //     if (!existingImage) {
    //         throw new HttpException('Image not found', 404);
    //     }

    //     let imageURL = existingImage.imageURL;

    //     // Jika ada file baru, ganti imageURL dan hapus file lama
    //     if (hasNewFile && newImageURL) {
    //         if (existingImage.imageURL) {
    //             const oldPath = join('.', existingImage.imageURL);
    //             try {
    //                 unlinkSync(oldPath);
    //             } catch (err) {
    //                 console.error('Gagal menghapus gambar lama:', err);
    //             }
    //         }
    //         imageURL = newImageURL;
    //     }

    //     const updated = await this.prismaService.productImage.update({
    //         where: { id: imageId },
    //         data: {
    //             product_id: updateRequest.product_id,
    //             isPrimary: updateRequest.isPrimary,
    //             iStatus: updateRequest.iStatus,
    //             imageURL,
    //             updatedBy: user.name,
    //             updatedAt: new Date(),
    //         },
    //     });

    //     return {
    //         imageURL: updated.imageURL,
    //         product_id: updated.product_id,
    //         isPrimary: updated.isPrimary,
    //         iStatus: updated.iStatus,
    //     };
    // }

    async findAllAdmin(page: number = 1, limit: number = 20): Promise<{ data: ProductResponse[], total: number }> {
        const skip = (page - 1) * limit;

        const [products, total] = await this.prismaService.$transaction([
            this.prismaService.product.findMany({
                // where: { iShowedStatus: 'Show' },
                include: {
                    ProductDesc: true,
                    ProductImage: true,
                },
                skip,
                take: limit,
            }),
            this.prismaService.product.count({
                // where: { iShowedStatus: 'Show' },
            }),
        ]);

        const result = products.map((product) => ({
            ...product,
            // Tambahan mapping khusus jika perlu
        }));

        return { data: result as ProductResponse[], total };
    }



    async findAll(page: number = 1, limit: number = 20): Promise<{ data: ProductResponse[], total: number }> {
        const skip = (page - 1) * limit;

        const [products, total] = await this.prismaService.$transaction([
            this.prismaService.product.findMany({
                where: { iShowedStatus: 'Show' },
                include: {
                    ProductDesc: true,
                    ProductImage: true,
                },
                skip,
                take: limit,
            }),
            this.prismaService.product.count({
                where: { iShowedStatus: 'Show' },
            }),
        ]);

        const result = products.map((product) => ({
            ...product,
            // Tambahan mapping khusus jika perlu
        }));

        return { data: result as ProductResponse[], total };
    }

    async findbyCategoryId(category_id: number): Promise<ProductResponse[]> {
        const products = await this.prismaService.product.findMany({
            where: { category_id },
            include: {
                ProductDesc: {},
                ProductImage: {},
            }
        });

        // console.log(products);

        const product = products.map((product) => {

            return {
                ...product,
            };
        });

        return product as ProductResponse[];
    }

    async findbyslug(slug: string): Promise<ProductResponse> {
        const product = await this.prismaService.product.findFirst({
            where: { slug },
            include: {
                ProductDesc: true,
                ProductImage: {},
            }
        });


        return product as ProductResponse;
    }

    async findbyname(name: string): Promise<ProductResponse[]> {
        const product = await this.prismaService.product.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: {
                ProductDesc: true,
                ProductImage: {},
            }
        });


        return product as ProductResponse[];
    }

    // async findbycategoryid(category_id: number): Promise<ProductResponse[]> {
    //     const products = await this.prismaService.product.findMany({
    //         where: { category_id },
    //         include: {
    //             ProductDesc: {},
    //             ProductImage: {},
    //         }
    //         // include: {
    //         //     Product: {
    //         //         select: {
    //         //             name: true,
    //         //             slug: true,
    //         //             eCatalogURL: true,
    //         //             remarks: true,
    //         //             iStatus: true,
    //         //             iShowedStatus: true,
    //         //             // ProductDesc: true,
    //         //             // ProductImage: true,

    //         //         },
    //         //     },
    //         // },
    //     });

    //     const product = products.map((product) => {
    //         // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
    //         // const primaryImageURL =
    //         //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
    //         return {
    //             ...product,
    //             // id: subcategory.id,
    //             // name: subcategory.name.trim(),
    //             // slug: subcategory.slug?.trim(),
    //             // catalog_id: product.catalog_id?.trim(),
    //             // register_id: product.register_id?.trim(),
    //             // category_id: subcategory.category_id,
    //             // subCategory_id: product.subCategory_id.trim(),
    //             // brand_id: product.brand_id.trim(),
    //             // uom_id: product.uom_id?.trim(),
    //             // primaryImageURL,
    //         };
    //     });

    //     return product as ProductResponse[];
    // }
}



// const productDesc = await this.prismaService.productDesc.create({
//     data: {
//         ...requestDesc,
//         ...{ createdBy: user.name },
//         ...{ product_id: product.id },
//     }
// })

// const productImage = await this.prismaService.productImage.create({
//     data: {
//         ...requestImage,
//         ...{ createdBy: user.name },
//         ...{ product_id: product.id },
//     }
// })