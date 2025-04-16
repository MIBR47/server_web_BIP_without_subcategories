import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { date } from 'zod';

export class BillboardResponse {
    title: string;
    description: string;
    // isShowBtn: boolean;
    // btnText: string;
    // isImage: boolean;
    contentURL: string;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    isImage: boolean;
    // content_id: string;
    // ProductDesc: ProductDesc[]

}

export class CreateBillboardRequest {
    title: string;
    description: string;
    // isShowBtn: boolean;
    // btnText: string;
    // isImage: boolean;
    contentURL: string;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    isImage: boolean;
    // content_id: string;
    // remarks: string;
}


