import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';
import { RequestGetDateTimesDto } from 'src/booking/dto/request-get-date-times-multi.dto';
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

    async getDatetimesMulti(companyId: string, masters: {masterId: string, serviceId: string[]}[], date?: string): Promise<any> {
        // Формируем service_id_list
        const service_id_list = masters.reduce((acc, master) => {
            return acc.concat(master.serviceId);
        }, []);
    
        // Формируем service_master_list
        const service_master_list = masters.reduce((acc, master) => {
            master.serviceId.forEach(serviceId => {
            acc[serviceId] = master.masterId;
            });
            return acc;
        }, {});
    
        // Параметры запроса
        const params = {
            company_id: companyId,
            type_multi: 'successively',
            service_id_list: service_id_list,
            service_master_list: service_master_list,
            service_id: service_id_list.join(','),
            date: date,
            with_first: '1'
        };
    
        const url = 'https://dikidi.ru/ru/mobile/ajax/newrecord/get_datetimes_multi/';

        const response = await lastValueFrom(
        this.httpService.get(url, { params }).pipe(
            map(response => response.data)
        ));
        return response;
    }

    async getDatesTrue(companyId: string, masters: {masterId: string, serviceId: string[]}[], dateFrom: string, dateTo: string,): Promise<any> {
        // Формируем service_id_list
        const serviceIdList = masters.reduce((acc, master) => {
            return acc.concat(master.serviceId);
        }, []);
    
        // Формируем service_master_list
        const serviceMasterList = masters.reduce((acc, master) => {
            master.serviceId.forEach(serviceId => {
            acc[serviceId] = master.masterId;
            });
            return acc;
        }, {});
    
        // Параметры запроса
        const params = {
            company_id: companyId,
            master_id: serviceMasterList,
            services_id: serviceIdList,
            date_from: dateFrom,
            date_to: dateTo
        };
    
        const url = 'https://dikidi.ru/ru/ajax/newrecord/get_dates_true/';

        const response = await lastValueFrom(
        this.httpService.get(url, { params }).pipe(
            map(response => response.data)
        ));
        return response;
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
                  'Cookie': '_gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; token=1b62cea52d3a8d631fdc643737430afe0d689253~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; cookie_name=b10c953aa551d6ffc81967b6f82d16ac07c01422~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; domain_sid=3cr88n8b57D3u00COfUNf%3A1724313471925; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; _ym_isad=1; cid=3b90e5e4cb16a088335a5c150d88728cf3bb3479~625144; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _ga_EDVSHP33JZ=GS1.1.1724397982.15.0.1724397982.60.0.0; _ym_visorc=w; tmr_detect=0%7C1724397988259'
                },
            }
        )
            .pipe(
                map(response => response.data)));
        return data;
    }

    async timeReservationMulti(companyId: string, masters: {masterId: string, serviceId: string[]}[], time: string): Promise<any> {

        // Формируем service_id_list
        const serviceIdList = masters.reduce((acc, master) => {
            return acc.concat(master.serviceId);
        }, []);
    
        // Формируем service_master_list
        const serviceMasterList = masters.reduce((acc, master) => {
            master.serviceId.forEach(serviceId => {
            acc[serviceId] = master.masterId;
            });
            return acc;
        }, {});

        const requestData = {
            service_id_list: serviceIdList,
            service_master_list: serviceMasterList,
            company_id: companyId,
            date: time,
            type: 'successively'
        };
        const formData = this.convertToURLSearchParams(requestData);

        const response = await firstValueFrom(
            this.httpService.post('https://dikidi.ru/ru/mobile/ajax/newrecord/time_reservation_multi/', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                    'Cookie': '_gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; token=1b62cea52d3a8d631fdc643737430afe0d689253~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; cookie_name=b10c953aa551d6ffc81967b6f82d16ac07c01422~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; domain_sid=3cr88n8b57D3u00COfUNf%3A1724313471925; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; _ym_isad=1; cid=3b90e5e4cb16a088335a5c150d88728cf3bb3479~625144; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _ga_EDVSHP33JZ=GS1.1.1724397982.15.0.1724397982.60.0.0; _ym_visorc=w; tmr_detect=0%7C1724397988259'
                  },
            }),
          );
        return response;
    }

    async check(type: string, companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const params = {
            company_id: companyId,
            //session: session,
            social_key: ''
        };

        const formData = new FormData();
        formData.append('company', type);
        formData.append('type', 'normal');
        //formData.append('session', session);
        formData.append('social_key', '');
        formData.append('shared_id', '0');
        formData.append('phone', phone);
        formData.append('first_name', firstName);
        formData.append('last_name', '');
        formData.append('comments', comment || '');
        formData.append('promocode_appointment_id', '');

        const response = await lastValueFrom(
            this.httpService.post('https://dikidi.ru/ru/mobile/newrecord/check/?company=591511&social_key=', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                    'Cookie': '_gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; token=1b62cea52d3a8d631fdc643737430afe0d689253~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; cookie_name=b10c953aa551d6ffc81967b6f82d16ac07c01422~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; domain_sid=3cr88n8b57D3u00COfUNf%3A1724313471925; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; _ym_isad=1; cid=3b90e5e4cb16a088335a5c150d88728cf3bb3479~625144; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _ga_EDVSHP33JZ=GS1.1.1724397982.15.0.1724397982.60.0.0; _ym_visorc=w; tmr_detect=0%7C1724397988259'
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

    async record(type: string, companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const params = {
            company_id: companyId,
            //session: session,
            social_key: ''
        };

        const formData = new URLSearchParams();
        formData.append('type', type);
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
                    'Cookie': '_gcl_au=1.1.921161648.1722239347; _ga=GA1.1.1176550732.1722239347; _ym_uid=1722239347150278790; _ym_d=1722239347; tmr_lvid=122e9c49ba431681d367c51703d7898a; tmr_lvidTS=1722239347097; journal-hide-not-work-items=1; owner-journal-select-items-position=false; visible_sidebar_cookie_2=show; owner-schedule-items-order=false; token=1b62cea52d3a8d631fdc643737430afe0d689253~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; cookie_name=b10c953aa551d6ffc81967b6f82d16ac07c01422~ca674aa828da00b60dc7b3efeb6a711b396a8aa2; domain_sid=3cr88n8b57D3u00COfUNf%3A1724313471925; lang=43bb664ecc8b6f42007ce39baebf98030f44b688~ru; _ym_isad=1; cid=3b90e5e4cb16a088335a5c150d88728cf3bb3479~625144; cookieCheckBlock=58c02c388a4a4a6aa9a2e23b0ccf147623384f65~1; _ga_EDVSHP33JZ=GS1.1.1724397982.15.0.1724397982.60.0.0; _ym_visorc=w; tmr_detect=0%7C1724397988259'
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

    convertToURLSearchParams(obj: any, namespace?: string): URLSearchParams {
        const params = new URLSearchParams();
        for (const property in obj) {
            if (!obj.hasOwnProperty(property) || obj[property] === undefined) {
                continue;
            }
            const formKey = namespace ? `${namespace}[${property}]` : property;
            if (obj[property] instanceof Date) {
                params.append(formKey, obj[property].toISOString());
            } else if (Array.isArray(obj[property])) {
                obj[property].forEach((element, index) => {
                    const tempFormKey = `${formKey}[${index}]`;
                    params.append(tempFormKey, element);
                });
            } else if (typeof obj[property] === 'object') {
                const nestedParams = this.convertToURLSearchParams(obj[property], formKey);
                for (const [key, value] of nestedParams.entries()) {
                    params.append(key, value);
                }
            } else {
                params.append(formKey, obj[property]);
            }
        }
        return params;
    }
}
