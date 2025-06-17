import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { date } from 'zod';

// export class NewsResponse {
//     title: string;
//     article?: string;
//     imageURL?: string;
//     iShowedStatus: WebsiteDisplayStatus;
//     remarks?: string;
//     newsTime?: Date;
//     // ProductDesc: ProductDesc[]

// }

// export class CreateNewsRequest {
//     title: string;
//     article: string;
//     imageURL?: string;
//     // iShowedStatus: WebsiteDisplayStatus;
//     remarks?: string;
//     newsTime?: Date;
//     // createdBy: string;
//     // createdAt: Date;

// }

// src/model/news.model.ts

// import { WebsiteDisplayStatus } from '@prisma/client';

export class CreateNewsRequest {
    title: string;
    slug: string;
    article?: string | null;
    imageURL?: string | null;
    iShowedStatus?: WebsiteDisplayStatus;
    remarks?: string | null;
    newsDate?: Date;
    contentURL?: string | null;
}

export class UpdateNewsRequest {
    id: number;
    title: string;
    slug: string;
    article?: string | null;
    imageURL?: string | null;
    iShowedStatus: WebsiteDisplayStatus;
    newsDate: Date;
    contentURL?: string | null;

}


export class NewsResponse {
    // id: number;
    title: string;
    slug: string;
    article?: string | null;
    imageURL?: string | null;
    iShowedStatus: WebsiteDisplayStatus;
    newsDate?: Date | null;
    contentURL?: string | null;
}




