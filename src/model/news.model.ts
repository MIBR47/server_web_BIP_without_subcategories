import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { date } from 'zod';

export class NewsResponse {
    title: string;
    article?: string;
    imageURL?: string;
    iShowedStatus: WebsiteDisplayStatus;
    remarks?: string;
    newsTime?: Date;
    // ProductDesc: ProductDesc[]

}

export class CreateNewsRequest {
    title: string;
    article: string;
    imageURL?: string;
    // iShowedStatus: WebsiteDisplayStatus;
    remarks?: string;
    newsTime?: Date;
    // createdBy: string;
    // createdAt: Date;

}


