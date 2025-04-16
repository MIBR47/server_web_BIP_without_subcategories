import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";

export class SubCategoryResponse {
    name: string;
    slug: string;
    remarks?: string;
    categoryId: number;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string;
    // ProductDesc: ProductDesc[]

}

export class CreateSubCategoryRequest {
    name: string;
    slug: string;
    remarks?: string;
    categoryId: number;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string;
    // createdBy: string;
    // createdAt: Date;

}


