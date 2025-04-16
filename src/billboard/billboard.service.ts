import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { CreateNewsRequest, NewsResponse } from 'src/model/news.model';
import { User, WebsiteDisplayStatus } from '@prisma/client';
import { BillboardResponse, CreateBillboardRequest } from 'src/model/billboard.model';
import { BillboardValidation } from './billboard.validation';





@Injectable()
export class BillboardService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {

    }
    //create subCategory
    async create(user: User, request: CreateBillboardRequest): Promise<BillboardResponse> {

        this.logger.info(`create new billboard ${JSON.stringify(request)}`);
        // this.logger.info(request.name);
        const createRequest: CreateBillboardRequest = this.validationService.validate(BillboardValidation.CREATE, request);

        const billboard = await this.prismaService.billboard.create({
            data: {
                ...createRequest,
                ...{ createdBy: user.username },
            }
        })
        var today = new Date;
        return {
            title: billboard.title ?? "",
            contentURL: billboard.contentURL ?? "",
            description: billboard.description ?? "",
            iShowedStatus: billboard.iShowedStatus,
            iStatus: billboard.iStatus,
            isImage: billboard.isImage ?? false


        }
    }

    async findShowenBillboard(
        IShowedStatus: WebsiteDisplayStatus,
    ): Promise<BillboardResponse> {
        const billboard = await this.prismaService.billboard.findFirstOrThrow({
            where: { iShowedStatus: IShowedStatus },
        });

        if (!billboard) {
            throw new NotFoundException(`Billboard where showed status 'show' not found`);
        }
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

        // return Billboard as BillboardResponse;
        return {
            title: billboard.title ?? "",
            contentURL: billboard.contentURL ?? "",
            description: billboard.description ?? "",
            iShowedStatus: billboard.iShowedStatus,
            iStatus: billboard.iStatus,
            isImage: billboard.isImage ?? false
        }
    }
}
