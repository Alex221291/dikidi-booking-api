import { Controller, Get, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto } from './dto/get-service.dto';

@Controller('booking')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
      ) {}

    @Get('company')
    async getCompany(@Query('companyId') companyId: number): Promise<GetCompanyDto | null> {
        return await this.bookingService.getCompany(companyId);
    }

    @Get('masters')
    async getMasters(@Query('companyId') companyId: number): Promise<GetMasterDto[] | []> {
        return await this.bookingService.getMasters(companyId);
    }

    @Get('masters/master/full-info')
    async getMaster(@Query('companyId') companyId: number, @Query('masterId') masterId: number): Promise<any> {
        return this.bookingService.getMasterFullInfo(companyId, masterId);
    }

    // @Get('masters/full-info')
    // async getMastersFullInfo(@Query('companyId') companyId: number): Promise<any> {
    //     return await this.bookingService.getMastersFullInfo(companyId);
    // }

    @Get('services')
    async getServices(@Query('companyId') companyId: number): Promise<GetCategoryWithServiceDto> {
        return this.bookingService.getServices(companyId);
    }

    @Get('datetimes')
    async getDatetimes(@Query('companyId') companyId: number, @Query('masterId') masterId: number, @Query('serviceId') serviceId: number, @Query('date') date: string): Promise<any> {
        const result =  await this.bookingService.getMasterServiceDatetimes(companyId, masterId, serviceId, date || '');
        return result;
    }
}
