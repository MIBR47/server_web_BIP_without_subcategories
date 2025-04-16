import {
    HttpException,
    Inject,
    Injectable
} from '@nestjs/common';
import { LoginUserRequestModel, RegisterUserRequestModel, UserResponseModel } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
    ) {

    }
    //Register user
    async create(request: RegisterUserRequestModel): Promise<UserResponseModel> {

        this.logger.info(`register new user ${JSON.stringify(request)}`);
        // this.logger.info(request.name);


        const registerRequest: RegisterUserRequestModel = this.validationService.validate(UserValidation.REGISTER, request);

        const totalUserwithSameEmail = await this.prismaService.user.count({
            where: {
                username: registerRequest.username,
            }
        });

        if (totalUserwithSameEmail != 0) {
            throw new HttpException('user already exits', 401);
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await this.prismaService.user.create({
            data: registerRequest,
        })

        return {
            name: user.name,
            username: user.username,
        }
    }
    //Login user
    async login(request: LoginUserRequestModel): Promise<UserResponseModel> {
        this.logger.info(`UserService.login(${JSON.stringify(request)})`);
        const loginRequest: LoginUserRequestModel = this.validationService.validate(
            UserValidation.LOGIN,
            request,
        );

        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username,
            },
        });

        if (!user) {
            throw new HttpException('Username or password is invalid', 401);
        }

        const isPasswordValid = await bcrypt.compare(
            loginRequest.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new HttpException('Username or password is invalid', 401);
        }

        user = await this.prismaService.user.update({
            where: {
                username: loginRequest.username,
            },
            data: {
                token: uuid(),
            },
        });

        return {
            username: user.username,
            name: user.name,
            token: user.token ?? '',
        };
    }
}


// findAll() {
//     return `This action returns all s`;
// }

// findOne(id: number) {
//     return `This action returns a #id `;
// }

// update(id: number, updateDto: UpdateDto) {
//     return `This action updates a #id `;
// }

// remove(id: number) {
//     return `This action removes a #id `;
// }