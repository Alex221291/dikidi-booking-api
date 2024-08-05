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
        return this.bookingService.getMasters(companyId);
    }

    @Get('services')
    async getServices(@Query('companyId') companyId: number): Promise<any> {
        return this.bookingService.getServices(companyId);
    }
}
