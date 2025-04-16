import { Module } from '@nestjs/common';
import { BillboardService } from './billboard.service';
import { BillboardController } from './billboard.controller';



@Module({
    // imports: [],
    controllers: [BillboardController],
    providers: [BillboardService],
    // exports: []
})
export class BillboardModule { }