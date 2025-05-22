import { MasterRecordStatusEnum, ProductDesc, ProductImage, WebsiteDisplayStatus } from "@prisma/client";


export class ProductResponse {
    id: number;
    catalog_id: string;
    name: string;
    slug: string;
    eCatalogURL?: string;
    remarks?: string;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    category_id: number;
    // isImage: boolean;
    // ProductDesc: ProductDescRequest[]
    // ProductImage: ProductImageRequest[]

}

export class ProductDescResponse {
    descriptions: string;
    productSpec: string;
    // benefits: string;
    product_id: number;
    // createdBy: string;
    // productSpec: string;
}

export class ProductDescRequest {
    descriptions: string;
    productSpec: string;
    benefits: string;
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
    createdBy: string;

}


export class CreateProductRequest {
    catalog_id: string;
    name: string;
    slug: string;
    eCatalogURL?: string;
    remarks?: string;
    iStatus: MasterRecordStatusEnum;
    iShowedStatus: WebsiteDisplayStatus;
    category_id: number;
    // ProductDesc: ProductDescRequest[];
    // ProductImage: ProductImageRequest[];
    // createdBy: string;
    // createdAt?: Date;

}




