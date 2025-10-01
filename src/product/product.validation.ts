import { MasterRecordStatusEnum, WebsiteDisplayStatus, ProductImage } from '@prisma/client';
import { ZodType, z } from "zod";

export class ProductValidation {
    static readonly CREATE: ZodType = z.object({
        catalog_id: z.string().min(1).max(20),
        name: z.string().min(1).max(250),
        slug: z.string().min(1).max(250),
        category_id: z.number(),
        eCatalogURL: z.string().min(1).max(250),
        // remarks: z.string().min(1).max(250),
        // iStatus: z.nativeEnum(MasterRecordStatusEnum),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        catalog_id: z.string().min(1).max(20),
        name: z.string().min(1).max(250),
        slug: z.string().min(1).max(250),
        category_id: z.number(),
        eCatalogURL: z.string().min(1).max(250),
        // remarks: z.string().min(1).max(250),
        // iStatus: z.nativeEnum(MasterRecordStatusEnum),
        iShowedStatus: z.nativeEnum(WebsiteDisplayStatus),
    });

}

export class ProductDescValidation {
    static readonly CREATE: ZodType = z.object({
        other_info: z.string().optional(),
        productSpec: z.array(
            z.object({
                label: z.string().min(1),
                value: z.string().min(1),
            })
        ).optional(), // kalau tidak wajib, bisa .optional()
        product_id: z.number(),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number(),
        other_info: z.string().optional(),
        productSpec: z.array(
            z.object({
                label: z.string().min(1),
                value: z.string().min(1),
            })
        ).optional(),
    });
}


export class ProductImageValidation {
    static readonly CREATE: ZodType = z.object({
        imageURL: z.string(),
        product_id: z.number(),
        isPrimary: z.boolean(),
        iStatus: z.nativeEnum(MasterRecordStatusEnum),
    })
    static readonly UPDATE: ZodType = z.object({
        // id: z.number(),
        // imageURL: z.string(),
        product_id: z.number(),
        isPrimary: z.boolean(),
        iStatus: z.nativeEnum(MasterRecordStatusEnum),
    })
}