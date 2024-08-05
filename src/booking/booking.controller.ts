import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
      ) {}

    @Get('masters')
    async getMasters(): Promise<any> {
      return this.bookingService.getMasters();
    }

    @Get('services')
    async getServices(): Promise<any> {
      return this.bookingService.getServices();
    }
}
