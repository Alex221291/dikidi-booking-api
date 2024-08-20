import { Controller, Get, Post, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto } from './dto/get-service.dto';

@Controller('booking')
export class BookingController {
    private readonly _companyId;
    constructor(
        private readonly bookingService: BookingService
      ) {
        this._companyId = process.env.COMPANY_ID;
      }

    @Get('company')
    async getCompany(): Promise<GetCompanyDto | null> {
        console.log(this._companyId);
        return await this.bookingService.getCompany(this._companyId);
    }

    @Get('masters')
    async getMasters(): Promise<GetMasterDto[] | []> {
        return await this.bookingService.getMasters(this._companyId);
    }

    @Get('masters/master/full-info')
    async getMaster(@Query('masterId') masterId: string): Promise<any> {
        return this.bookingService.getMasterFullInfo(this._companyId, masterId);
    }

    // @Get('masters/full-info')
    // async getMastersFullInfo(@Query('companyId') companyId: number): Promise<any> {
    //     return await this.bookingService.getMastersFullInfo(companyId);
    // }

    @Get('services')
    async getServices(): Promise<GetCategoryWithServiceDto> {
        return this.bookingService.getServices(this._companyId);
    }

    @Get('datetimes')
    async getMasterServiceDatetimes(@Query('masterId') masterId: string, @Query('serviceId') serviceId: string[], @Query('date') date: string): Promise<any> {
        const result =  await this.bookingService.getMasterServiceDatetimes(this._companyId, masterId, serviceId, date || '');
        return result;
    }

    @Post('new-record')
    async newRecord(@Query('masterId') masterId: string, @Query('serviceId') serviceId: string[], @Query('time') time: string, @Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.newRecord(this._companyId, masterId, serviceId, time, phone, firstName, comment);
        return result;
    }

    @Get('new-record/time-reservation')
    async timeReservation(@Query('masterId') masterId: string, @Query('serviceId') serviceId: string[], @Query('time') time: string): Promise<any> {
        const result =  await this.bookingService.timeReservation(this._companyId, masterId, serviceId, time);
        return result;
    }

    @Post('new-record/check')
    async check(@Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.check(this._companyId, phone, firstName, comment);
        return result;
    }

    @Post('new-record/record')
    async record(@Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.record(this._companyId, phone, firstName, comment);
        return result;
    }

    @Get('new-record/records-info')
    async recordsInfo(@Query('recordId') recordId: string[]): Promise<any> {
        const result =  await this.bookingService.recordInfo(this._companyId, recordId);
        return result;
    }
}
