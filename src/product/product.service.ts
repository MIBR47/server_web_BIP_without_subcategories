import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User, ProductImage } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreateProductRequest, ProductDescRequest, ProductDescResponse, ProductImageRequest, ProductImageResponse, ProductResponse } from 'src/model/product.model';
import { Logger } from 'winston';
import { ProductDescValidation, ProductImageValidation, ProductValidation } from './product.validation';
import * as request from 'supertest';


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
            throw new HttpException('product already exits', 401);
        }

        const product = await this.prismaService.product.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.name },
            }

        })



        return {
            catalog_id: product.catalog_id?.trim() ?? "",
            name: product.name,
            slug: product.slug ?? '',
            remarks: product.remarks ?? '',
            iStatus: product.iStatus,
            iShowedStatus: product.iShowedStatus,
            category_id: product.category_id,
            // ProductDesc: [{
            //     descriptions: productDesc.descriptions ?? " ",
            //     productSpec: productDesc.productSpec ?? " ",
            //     product_id: product.id,
            //     benefits: productDesc.benefits ?? " ",

            // }],
            // ProductImage: [{
            //     imageURL: productImage.imageURL ?? " ",
            //     isPrimary: productImage.isPrimary ?? " ",
            //     product_id: product.id,
            //     iStatus: productImage.iStatus ?? " ",

            // }],

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
            descriptions: productDesc.descriptions ?? "",
            productSpec: productDesc.productSpec ?? "",
            benefits: productDesc.benefits ?? "",
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

    async findAll(): Promise<ProductResponse[]> {
        const products = await this.prismaService.product.findMany({
            where: { iShowedStatus: 'SHOW' },
            include: {
                ProductDesc: {},
                ProductImage: {},
            }
            // include: {
            //     Product: {
            //         select: {
            //             name: true,
            //             slug: true,
            //             eCatalogURL: true,
            //             remarks: true,
            //             iStatus: true,
            //             iShowedStatus: true,
            //             // ProductDesc: true,
            //             // ProductImage: true,

            //         },
            //     },
            // },
        });

        const product = products.map((product) => {
            // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
            // const primaryImageURL =
            //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
            return {
                ...product,
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

        return product as ProductResponse[];
    }
    async findbyid(category_id: number): Promise<ProductResponse[]> {
        const products = await this.prismaService.product.findMany({
            where: { category_id },
            include: {
                ProductDesc: {},
                ProductImage: {},
            }
            // include: {
            //     Product: {
            //         select: {
            //             name: true,
            //             slug: true,
            //             eCatalogURL: true,
            //             remarks: true,
            //             iStatus: true,
            //             iShowedStatus: true,
            //             // ProductDesc: true,
            //             // ProductImage: true,

            //         },
            //     },
            // },
        });

        const product = products.map((product) => {
            // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
            // const primaryImageURL =
            //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
            return {
                ...product,
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

        return product as ProductResponse[];
    }

    async findbycategoryid(category_id: number): Promise<ProductResponse[]> {
        const products = await this.prismaService.product.findMany({
            where: { category_id },
            include: {
                ProductDesc: {},
                ProductImage: {},
            }
            // include: {
            //     Product: {
            //         select: {
            //             name: true,
            //             slug: true,
            //             eCatalogURL: true,
            //             remarks: true,
            //             iStatus: true,
            //             iShowedStatus: true,
            //             // ProductDesc: true,
            //             // ProductImage: true,

            //         },
            //     },
            // },
        });

        const product = products.map((product) => {
            // const primaryImages = subcategory.images.filter((image) => image.isPrimary);
            // const primaryImageURL =
            //     primaryImages.length > 0 ? primaryImages[0].imageURL : null;
            return {
                ...product,
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

        return product as ProductResponse[];
    }
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