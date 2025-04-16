import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { webResponse, webResponse2 } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User, WebsiteDisplayStatus } from '@prisma/client';
import { BillboardService } from './billboard.service';
import { BillboardResponse, CreateBillboardRequest } from 'src/model/billboard.model';

@Controller('/api/billboard')
export class BillboardController {
    constructor(private billboardService: BillboardService) { }


    @Post('/admin/create')
    @HttpCode(200)
    async create(@Auth() user: User, @Body() request: CreateBillboardRequest): Promise<webResponse<BillboardResponse>> {
        const result = await this.billboardService.create(user, request);

        return {
            data: result
        };
    }

    @Get('/findbillboard/:iShowedStatus')
    async findShowenBillboard(
        @Param('iShowedStatus') iShowedStatus: WebsiteDisplayStatus,
    ): Promise<BillboardResponse> {

        const result = await this.billboardService.findShowenBillboard(iShowedStatus);
        return result;

    }


}
