import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';
@Injectable()
export class DikidiService {
    constructor(private readonly httpService: HttpService) {}

    onModuleInit() {
        this.httpService.axiosRef.interceptors.request.use(request => {
          console.log('Starting Request', request);
          return request;
        });
    
        // this.httpService.axiosRef.interceptors.response.use(response => {
        //   console.log('Response:', response);
        //   return response;
        // });
      }

    async getMasters(companyId: string): Promise<any> {
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/ajax/newrecord/to_master_get_masters/?company_id=${companyId}`)
            .pipe(
                map(response => response.data)));
        return data;
    }

    async getServices(companyId: string): Promise<any> {
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/mobile/ajax/newrecord/company_services/?lang=ru&array=1&company=${companyId}&master=&share=`)
            .pipe(
                map(response => response.data)));
        return data;
    }

    async getCompany(companyId: string): Promise<any> {
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/mobile/ajax/newrecord/project_options/?company=${companyId}&social_key=`)
            .pipe(
                map(response => response.data)));
        return data;
    }

    async getMaster(companyId: string, masterId: string): Promise<any> {
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/mobile/ajax/newrecord/master_info/?social_key=&company_id=${companyId}&master_id=${masterId}`)
            .pipe(
                map(response => response.data)));
        return data;
    }

    async getDatetimes(companyId: string, masterId: string, serviceId: string, date: string): Promise<any> {
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/mobile/ajax/newrecord/get_datetimes/?company_id=${companyId}&date=${date}&service_id%5B%5D=${serviceId}&master_id=${masterId}`)
            .pipe(
                map(response => response.data)));
        return data;
    }

    async getDatetimesMulti(companyId: string, masterId: string, serviceId: string, date: string): Promise<any> {
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/mobile/ajax/newrecord/get_datetimes/?company_id=${companyId}&date=${date}&service_id%5B%5D=${serviceId}&master_id=${masterId}`)
            .pipe(
                map(response => response.data)));
        return data;
    }

    async timeReservation(companyId: string, masterId: string, serviceId: string[], time: string): Promise<any> {
        const params = {
            company_id: companyId,
            master_id: masterId,
            services_id: serviceId,
            time: time,
            action_source: 'dikidi',
            //session: session
        };
        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/ajax/newrecord/time_reservation/`,
            {
                params,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Accept': 'application/json, text/javascript, */*; q=0.01',
                  'Accept-Encoding': 'gzip, deflate, br, zstd',
                  'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                  'Cookie': 'cid=5276c1e7228e24cbddb30090823f7c46376bdf6c~620127; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; journal-disabled-hint=%5B4%5D; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; token=35c5ab75f5eb0d6b98289b5879c7c958ca90fe51~e535b448c9149e986df7a7dcb1e988ba2f40d723; cookie_name=a35a4e22c45d69f2a992771aeef65930f91d81f0~e535b448c9149e986df7a7dcb1e988ba2f40d723; _ga_EDVSHP33JZ=GS1.1.1723968074.12.0.1723968074.60.0.0; _ym_isad=1; domain_sid=3cr88n8b57D3u00COfUNf%3A1724146882951; tmr_detect=0%7C1724146890688',
  
                },
            }
        )
            .pipe(
                map(response => response.data)));
        return data;
    }

    async check(companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const params = {
            company_id: companyId,
            //session: session,
            social_key: ''
        };

        const formData = new URLSearchParams();
        formData.append('company', companyId);
        formData.append('type', 'normal');
        //formData.append('session', session);
        formData.append('social_key', '');
        formData.append('shared_id', '0');
        formData.append('phone', phone);
        formData.append('first_name', firstName);
        formData.append('last_name', '');
        formData.append('comments', comment || '');
        formData.append('promocode_appointment_id', '');

        const response = await firstValueFrom(
            this.httpService.post('https://dikidi.ru/ru/mobile/newrecord/check/?company=591511&social_key=', formData, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                'Cookie': 'cid=5276c1e7228e24cbddb30090823f7c46376bdf6c~620127; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; journal-disabled-hint=%5B4%5D; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; token=35c5ab75f5eb0d6b98289b5879c7c958ca90fe51~e535b448c9149e986df7a7dcb1e988ba2f40d723; cookie_name=a35a4e22c45d69f2a992771aeef65930f91d81f0~e535b448c9149e986df7a7dcb1e988ba2f40d723; _ga_EDVSHP33JZ=GS1.1.1723968074.12.0.1723968074.60.0.0; _ym_isad=1; domain_sid=3cr88n8b57D3u00COfUNf%3A1724146882951; tmr_detect=0%7C1724146890688',
              },
            }),
          );
        // const data = lastValueFrom(this.httpService.post(`https://dikidi.ru/ru/mobile/newrecord/check/`,
        //     formData, {params,
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //         }
        //     }
        // )
        //     .pipe(
        //         map(response => response.data)));
        return response?.data;
    }

    async record(companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const params = {
            company_id: companyId,
            //session: session,
            social_key: ''
        };

        const formData = new URLSearchParams();
        formData.append('type', 'normal');
        //formData.append('session', session);
        formData.append('shared_id', '0');
        formData.append('phone', phone);
        formData.append('name', firstName);
        formData.append('first_name', firstName);
        formData.append('last_name', '');
        formData.append('comments', comment || '');
        formData.append('is_show_all_times', '3');
        formData.append('action_source', 'direct_link');
        formData.append('social_key', '');
        formData.append('active_cart_id', '0');
        formData.append('active_method', '0');
        formData.append('agreement', '1');

        // const data = lastValueFrom(this.httpService.post(`https://dikidi.ru/ru/ajax/newrecord/record/`,
        //     formData, {params,
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //         }
        //     }
        // )
        //     .pipe(
        //         map(response => response.data)));
        // return data;
        const response = await firstValueFrom(
            this.httpService.post('https://dikidi.ru/ru/ajax/newrecord/record/?company_id=591511&social_key=', formData, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                'Cookie': 'cid=5276c1e7228e24cbddb30090823f7c46376bdf6c~620127; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; journal-disabled-hint=%5B4%5D; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; token=35c5ab75f5eb0d6b98289b5879c7c958ca90fe51~e535b448c9149e986df7a7dcb1e988ba2f40d723; cookie_name=a35a4e22c45d69f2a992771aeef65930f91d81f0~e535b448c9149e986df7a7dcb1e988ba2f40d723; _ga_EDVSHP33JZ=GS1.1.1723968074.12.0.1723968074.60.0.0; _ym_isad=1; domain_sid=3cr88n8b57D3u00COfUNf%3A1724146882951; tmr_detect=0%7C1724146890688',

              },
            }),
          );
      
          return response.data;
    }

    async recordsInfo(companyId: string, recordIdList: string[]): Promise<any> {
        const params = {
            company_id: companyId,
            //session: session,
            record_id_list: recordIdList
        };

        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/mobile/ajax/newrecord/records_info/`,
            {params}
        )
            .pipe(
                map(response => response.data)));
        return data
    }
}
