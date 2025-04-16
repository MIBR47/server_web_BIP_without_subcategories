// import {
//     Body,
//     Controller,
//     Delete,
//     Get,
//     HttpCode,
//     Param,
//     Patch,
//     Post,
// } from '@nestjs/common';
// import { SubCategoryService } from './subCategory.service';
// import { SubCategoryResponse, CreateSubCategoryRequest } from 'src/model/subcategory.model';
// import { webResponse } from 'src/model/web.model';
// import { Auth } from 'src/common/auth.decorator';
// import { User } from '@prisma/client';

// @Controller('/api/subcategory')
// export class SubCategoryController {
//     constructor(private subCategoryService: SubCategoryService) { }


//     @Post('/admin/create')
//     @HttpCode(200)
//     async create(@Auth() user: User, @Body() request: CreateSubCategoryRequest): Promise<webResponse<SubCategoryResponse>> {
//         const result = await this.subCategoryService.create(user, request);

//         return {
//             data: result
//         };
//     }

//     // @Public()
//     @Get('/findbyslug/:slug')
//     async findAllByslug(
//         @Param('slug') slug: string,
//     ): Promise<webResponse<SubCategoryResponse[]>> {
//         const result = await this.subCategoryService.findByslug(slug);
//         return {
//             data: result
//         }
//     }

//     @Get('/findbycategoryid/:id')
//     async findAllByCategoryId(
//         @Param('categoryId') categoryID: number,
//     ): Promise<webResponse<SubCategoryResponse[]>> {
//         // console.log("param kebaca?" + id);
//         const result = await this.subCategoryService.findByCategoryId(categoryID);
//         return {
//             data: result
//         }
//     }


// }
