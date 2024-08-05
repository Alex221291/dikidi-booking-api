import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { map, Observable } from 'rxjs';

@Injectable()
export class DikidiService {
    constructor(private readonly httpService: HttpService) {}

  async getMasters(): Promise<any> {
    const data = this.httpService.get("https://dikidi.ru/ru/ajax/newrecord/to_master_get_masters/?company_id=591511")
        .pipe(
            map(response => response.data));
    return data;
  }

  async getServices(): Promise<any> {
    const data = this.httpService.get("https://dikidi.ru/mobile/ajax/newrecord/company_services/?lang=ru&array=1&company=591511&master=&share=")
        .pipe(
            map(response => response.data));
    return data;
  }
}
