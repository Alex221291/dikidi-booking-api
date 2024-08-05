import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class DikidiService {
    constructor(private readonly httpService: HttpService) {}

  async getMasters(companyId: number): Promise<any> {
    const data = this.httpService.get(`https://dikidi.ru/ru/ajax/newrecord/to_master_get_masters/?company_id=${companyId}`)
        .pipe(
            map(response => response.data));
    return data;
  }

  async getServices(companyId: number): Promise<any> {
    const data = this.httpService.get(`https://dikidi.ru/mobile/ajax/newrecord/company_services/?lang=ru&array=1&company=${companyId}&master=&share=`)
        .pipe(
            map(response => response.data));
    return data;
  }

  async getCompany(companyId: number): Promise<any> {
    const session = process.env.SESSION;
    const data = this.httpService.get(`https://dikidi.ru/ru/mobile/ajax/newrecord/project_options/?company=${companyId}&session=${session}&social_key=`)
        .pipe(
            map(response => response.data));
    return data;
  }
}
