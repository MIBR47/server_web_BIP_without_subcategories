import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
// import { RegisterUserRequestModel, UserResponseModel } from 'src/model/user.model';
// import { UserValidation } from 'src/user/user.validation';
// import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
// import { v4 as uuid } from 'uuid';
import { CategoryValidation } from './category.validation';
import { CategoryResponse, CreateCategoryRequest } from 'src/model/category.model';
import { User, Category } from '@prisma/client';


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
        // this.logger.info(request.name);



        const createRequest: CreateCategoryRequest = this.validationService.validate(CategoryValidation.CREATE, request);

        // let user = await this.prismaService.user.findFirst({
        //     where: {
        //         name: createRequest.createdBy,
        //     },
        // });

        const totalCategorywithSameName = await this.prismaService.category.count({
            where: {
                slug: createRequest.slug,
            }
        });

        if (totalCategorywithSameName != 0) {
            throw new HttpException('category already exits', 401);
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
            iStatus: category.iStatus,
            iShowedStatus: category.iShowedStatus,
            imageURL: category.imageURL ?? '',
        }
    }

    async findAll(
        // category_id: number,
    ): Promise<CategoryResponse[]> {
        const Categories = await this.prismaService.category.findMany({
            where: { iShowedStatus: 'SHOW' },
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
}
