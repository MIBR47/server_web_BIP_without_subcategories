import { MasterRecordStatusEnum, WebsiteDisplayStatus } from "@prisma/client";
import { ZodType, z } from "zod";

export class SubCategoryValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        remarks: z.string().min(1).max(100),
        categoryId: z.number().min(1).positive(),
        iStatus: z.nativeEnum(MasterRecordStatusEnum),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
        imageURL: z.string().url()
    });
}