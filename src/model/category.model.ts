import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { Timestamp } from "rxjs";

export class CategoryResponse {
    name: string;
    slug: string;
    remarks?: string;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string;
    // ProductDesc: ProductDesc[]

}

export class CreateCategoryRequest {
    name: string;
    slug: string;
    remarks?: string;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string;
    // createdBy: string;
    // createdAt: Date;

}


