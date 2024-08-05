import { Injectable } from '@nestjs/common';
import { DikidiService } from 'src/dikidi/dikidi.service';

@Injectable()
export class BookingService {
    constructor(private dikidiService: DikidiService)
    {}

    async getMasters(): Promise<any> {
        const result =  await this.dikidiService.getMasters();
        return result;
    }

    async getServices(): Promise<any> {
        const result =  await this.dikidiService.getServices();
        return result;
    }
}
