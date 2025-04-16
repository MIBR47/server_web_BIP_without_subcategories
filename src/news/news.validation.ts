import { WebsiteDisplayStatus } from "@prisma/client";
import { ZodType, z } from "zod";

export class NewsValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string(),
        article: z.string(),
        imageURL: z.string().url(),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
        remarks: z.string(),
        newsTime: z.string()
    });
}