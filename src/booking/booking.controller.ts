import { Controller, Get, Query } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
      ) {}

    @Get('company')
    async getCompany(@Query('companyId') companyId: number): Promise<any> {
        return this.bookingService.getCompany(companyId);
    }

    @Get('masters')
    async getMasters(@Query('companyId') companyId: number): Promise<any> {
        console.log('controller - ' + companyId);
        return this.bookingService.getMasters(companyId);
    }

    @Get('masters/info')
    async getMaster(@Query('companyId') companyId: number, @Query('masterId') masterId: number): Promise<any> {
        return this.bookingService.getMaster(companyId, masterId);
    }

    @Get('services')
    async getServices(@Query('companyId') companyId: number): Promise<any> {
        return this.bookingService.getServices(companyId);
    }

    @Get('datetimes')
    async getDatetimes(@Query('companyId') companyId: number, @Query('masterId') masterId: number, @Query('serviceId') serviceId: number, @Query('date') date: string): Promise<any> {
        const result =  await this.bookingService.getDatetimes(companyId, masterId, serviceId, date);
        return result;
    }
}
