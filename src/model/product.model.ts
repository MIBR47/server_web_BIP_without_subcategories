import { MasterRecordStatusEnum, ProductDesc, ProductImage, WebsiteDisplayStatus } from "@prisma/client";


export class ProductResponse {
    id: number;
    catalog_id: string;
    name: string;
    slug: string;
    eCatalogURL: string | null;
    // remarks: string | null;
    // iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    category_id: number;
    // isImage: boolean;
    // ProductDesc: ProductDescRequest[]
    // ProductImage: ProductImageRequest[]

}

export class ProductDescResponse {
    other_info: string;
    productSpec: { label: string; value: string }[];
    // benefits: string;
    product_id: number;
    // createdBy: string;
    // productSpec: string;
}

export class ProductDescRequest {
    other_info: string;
    productSpec: { label: string; value: string }[];
    // benefits: string;
    product_id: number;
    createdBy: string;
    // productSpec: string;
}

export class ProductImageResponse {
    imageURL: string;
    product_id: number;
    isPrimary: boolean;
    iStatus: MasterRecordStatusEnum;
}

export class ProductImageRequest {
    imageURL: string;
    product_id: number;
    isPrimary: boolean;
    iStatus: MasterRecordStatusEnum;
    // createdBy: string;

}


export class CreateProductRequest {
    id: number;
    catalog_id: string;
    name: string;
    slug: string;
    eCatalogURL?: string;
    remarks?: string;
    // iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    category_id: number;
    // ProductDesc: ProductDescRequest[];
    // ProductImage: ProductImageRequest[];
    // createdBy: string;
    // createdAt?: Date;

}

export class UpdateProductRequest {
    id: number;
    catalog_id: string;
    name: string;
    slug: string;
    eCatalogURL?: string;
    remarks?: string;
    // iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    category_id: number;
    // ProductDesc: ProductDescRequest[];
    // ProductImage: ProductImageRequest[];
    // createdBy: string;
    // createdAt?: Date;

}
export class UpdateProductImageRequest {
    // id: number;
    // imageURL: string;
    product_id: number;
    isPrimary: boolean;
    iStatus: MasterRecordStatusEnum;
    // createdBy: string;

}




