import { WebsiteDisplayStatus } from "@prisma/client";
import { ZodType, z } from "zod";

// export class NewsValidation {
//     static readonly CREATE: ZodType = z.object({
//         title: z.string(),
//         article: z.string(),
//         imageURL: z.string().url(),
//         iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
//         remarks: z.string(),
//         newsTime: z.string()
//     });
// }
export class NewsValidation {
    static readonly CREATE: ZodType = z.object({
        // id: z.number(),
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        article: z.string(),
        imageURL: z.string().max(250).optional(),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
        // remarks: z.string().max(250).optional(),
        newsDate: z.preprocess((val) => {
            if (typeof val === "string" || val instanceof Date) {
                return new Date(val);
            }
            return val;
        }, z.date()),
        contentURL: z.string().max(250).optional(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        article: z.string().optional(),
        imageURL: z.string().max(250).optional(),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
        // remarks: z.string().max(250).optional(),
        newsDate: z.coerce.date().optional(), // untuk DateTime input sebagai string
        contentURL: z.string().max(250).optional(),
    });
}