import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RecordService } from './record.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { User } from 'src/auth/user.decorator';
import dayjs from 'dayjs';
import { ResponseGetRecordShortInfoDto } from './dto/response-get-record-full-info.dto';
import { ResponseGetRecordFullInfoDto } from './dto/response-get-record-short-info.dto';

@Controller('record')
export class RecordController {
    constructor(
        private readonly recordService: RecordService,
      ) {}

    @UseGuards(JwtAuthGuard)
    @Get('get-dates-true')
    async getDatesTrue(@User() user: UserPayloadDto, @Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo: string,): Promise<string[]> {
        const result =  await this.recordService.GetRecordsDatesTrue(user.dkdCompanyId, user.clientId, dateFrom, dateTo);
        return result;
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getById(@User() user: UserPayloadDto, @Param('id') id: string): Promise<ResponseGetRecordFullInfoDto | null> {
        return await this.recordService.getById(user.clientId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@User() user: UserPayloadDto, @Query('date') date: string): Promise<ResponseGetRecordShortInfoDto[]> {
        return await this.recordService.getClientRecordsList(user.clientId, user.clientId, date);
    }
}
