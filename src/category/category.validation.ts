import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { ZodType, z } from "zod";

export class CategoryValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        remarks: z.string().min(1).max(100),
        iStatus: z.nativeEnum(MasterRecordStatusEnum),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
        imageURL: z.string().min(1).max(100),

    });


}