export class webResponse<T> {
    data?: T;
    errors?: string;
}
export class webResponse2<T> {
    T;
    errors?: string;
}

export class webResponseWithTotal<T> {
    data?: T;
    total?: number;
    errors?: string;
}