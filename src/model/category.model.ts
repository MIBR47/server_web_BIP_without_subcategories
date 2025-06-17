import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { Timestamp } from "rxjs";

export class CategoryResponse {
    name: string;
    slug: string;
    remarks?: string;
    // iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string | null;
    // ProductDesc: ProductDesc[]

}

export class CreateCategoryRequest {
    name: string;
    slug: string;
    remarks?: string;
    // iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string | null;
    // createdBy: string;
    // createdAt: Date;

}

export class UpdateCategoryRequest {
    id: number;
    name: string;
    slug: string;
    remarks?: string | null;
    // iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    imageURL?: string | null;
}

