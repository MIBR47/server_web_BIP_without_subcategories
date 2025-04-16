// import { HttpException, Inject, Injectable } from '@nestjs/common';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { PrismaService } from 'src/common/prisma.service';
// import { ValidationService } from 'src/common/validation.service';
// import { Logger } from 'winston';
// // import { v4 as uuid } from 'uuid';
// import { SubCategoryResponse, CreateSubCategoryRequest } from 'src/model/subcategory.model';
// import { User, Category } from '@prisma/client';
// // import { SubCategoryValidation } from './subCategory.validation';
// import { SubCategoryValidation } from './subCategory.validation';
// import { connect } from 'http2';
// // import { SubCategoryValidation } from './subcategory.validation';




// @Injectable()
// export class SubCategoryService {
//     constructor(
//         private validationService: ValidationService,
//         @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
//         private prismaService: PrismaService,
//     ) {

//     }
//     //create subCategory
//     async create(user: User, request: CreateSubCategoryRequest): Promise<SubCategoryResponse> {

//         this.logger.info(`create new subcategory ${JSON.stringify(request)}`);
//         // this.logger.info(request.name);
//         const createRequest: CreateSubCategoryRequest = this.validationService.validate(SubCategoryValidation.CREATE, request);

//         const totalSubCategorywithSameName = await this.prismaService.subCategory.count({
//             where: {
//                 slug: createRequest.slug,
//             }
//         });

//         // this.logger.info(`test`);

//         if (totalSubCategorywithSameName != 0) {
//             throw new HttpException('subcategory already exits', 401);
//         }
//         // this.logger.info(`test1`);
//         // console.log("test-1")

//         const category = await this.prismaService.category.findFirst({
//             where: {
//                 id: createRequest.categoryId
//             }
//         })
//         // this.logger.info(`id sama dengan ${category?.id} dan ${createRequest.imageURL}`);
//         // this.logger.info(`test2`);
//         // console.log("test-2")

//         const subCategory = await this.prismaService.subCategory.create({
//             data: {
//                 ...createRequest,
//                 ...{ createdBy: user.name, categoryId: category?.id! },
//             }
//             // include: {
//             //     Category: true
//             // }
//         })
//         // this.logger.info(`test3`);
//         return {
//             name: subCategory.name,
//             slug: subCategory.slug ?? '',
//             remarks: subCategory.remarks ?? '',
//             categoryId: subCategory.categoryId,
//             iStatus: subCategory.iStatus,
//             iShowedStatus: subCategory.iShowedStatus,
//             imageURL: subCategory.imageURL ?? " ",
//         }
//     }

//     async findByslug(
//         slug: string,
//     ): Promise<SubCategoryResponse[]> {
//         // console.log(category_id)
//         const subCategories = await this.prismaService.subCategory.findMany({
//             where: {
//                 // categoryId: category_id,
//                 slug: slug,
//                 iShowedStatus: 'SHOW'
//             },
//         });

//         const subcategory = subCategories.map((subcategory) => {
//             return {
//                 ...subcategory,
//             };
//         });

//         return subcategory as SubCategoryResponse[];
//     }

//     async findByCategoryId(
//         categoryid: number,
//     ): Promise<SubCategoryResponse[]> {
//         // console.log("param kebaca lagi?" + id);

//         // console.log(category_id)
//         const subCategories = await this.prismaService.subCategory.findMany({
//             where: {
//                 // categoryId: category_id,
//                 categoryId: categoryid,
//                 // iShowedStatus: 'SHOW'
//             },
//         });

//         const subcategory = subCategories.map((subcategory) => {
//             return {
//                 ...subcategory,
//             };
//         });

//         return subcategory as SubCategoryResponse[];
//     }
// }
