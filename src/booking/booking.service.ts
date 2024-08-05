import { Injectable } from '@nestjs/common';
import { DikidiService } from 'src/dikidi/dikidi.service';

@Injectable()
export class BookingService {
    constructor(private dikidiService: DikidiService)
    {}

    async getCompany(companyId: number): Promise<any> {
        const result =  await this.dikidiService.getCompany(companyId);
        return result;
    }

    async getMasters(companyId: number): Promise<any> {
        const result =  await this.dikidiService.getMasters(companyId);
        return result;
    }

    async getServices(companyId: number): Promise<any> {
        const result =  await this.dikidiService.getServices(companyId);
        return result;
    }

    async getMaster(companyId: number, masterId: number): Promise<any> {
        const result =  await this.dikidiService.getMaster(companyId, masterId);
        return result;
    }

    async getDatetimes(companyId: number, masterId: number, serviceId: number, date: string): Promise<any> {
        const result =  await this.dikidiService.getDatetimes(companyId, masterId, serviceId, date);
        return result;
    }
}
