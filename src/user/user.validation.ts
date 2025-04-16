import { z, ZodType } from "zod";

// export class userValidation {
//     static readonly REGISTER: ZodType = z.object({
//         name: z.string().min(1).max(50),
//         password: z.string().min(1).max(255),
//         email: z.string().min(1).max(100),
//         isAdmin: z.boolean(),
//     })
// }

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
    });

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
    });
}