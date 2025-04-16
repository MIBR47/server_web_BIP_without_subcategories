import { MasterRecordStatusEnum } from "@prisma/client";

// export class RegisterUserRequestModel {
//     // id: number;
//     name: string;
//     password: string;
//     email: string;
// }

// export class UserResponseModel {
//     name: string;
//     email: string;
//     isAdmin?: boolean;
//     iStatus?: MasterRecordStatusEnum;
//     image?: string;
//     hashedRefreshToken?: string;
// }
export class UserResponseModel {
    username: string;
    name: string;
    token?: string;
}

export class RegisterUserRequestModel {
    username: string;
    password: string;
    name: string;
}


export class LoginUserRequestModel {
    username: string
    password: string
}