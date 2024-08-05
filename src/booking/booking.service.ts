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
}
