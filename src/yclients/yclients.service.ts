import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';
import { RequestGetDateTimesDto } from 'src/booking/dto/request-get-date-times-multi.dto';
@Injectable()
export class YclientsService {
    private readonly ycHeaders;
    constructor(private readonly httpService: HttpService) {
        this.ycHeaders = {
            'Authorization': `Bearer ${process.env.YC_PATNER_TOKEN}`,
            'Accept': process.env.YC_ACCEPT,
            'Content-Type': process.env.YC_CONTENT_TYPE,
        };
    }

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

    async getMasters(companyId: string): Promise<AxiosResponse<any, any>> {
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/book_staff/${companyId}`, {headers: this.ycHeaders}));
        return result;
    }

    async getMastersMulti(companyId: string, serviceId: string[]): Promise<any> {
        const params = {
            company_id: companyId,
            service_id_list: serviceId,
        };
    
        const url = 'https://dikidi.ru/ru/mobile/ajax/newrecord/get_masters_multi/';

        const response = await lastValueFrom(
        this.httpService.get(url, { params }).pipe(
            map(response => response.data)
        ));
        return response;
    }

    async getServices(companyId: string, staffId?: string, datetime?: string, serviceIds?: string[]): Promise<AxiosResponse<any, any>> {
        const params = {
            staff_id: staffId,
            datetime,
            service_ids: serviceIds
        }
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/book_services/${companyId}`, {params, headers: this.ycHeaders}));
        return result;
    }

    async getCompany(companyId: string): Promise<any> {
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/company/${companyId}`, {headers: this.ycHeaders}));
        return result;
    }

    async getDatetimesMulti(companyId: string, staffId: string, date: string, serviceIds?: string[]): Promise<any> {
        const params = {
            service_ids: serviceIds
        }
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/book_times/${companyId}/${staffId}/${date}`, {params, headers: this.ycHeaders}));
        return result;
    }

    async getDatesTrue(companyId: string, masterId: string, serviceId: string[], dateFrom: string, dateTo: string,): Promise<any> {
        const params = {
            staff_id: masterId,
            service_ids: serviceId,
            date_from: dateFrom,
            date_to: dateTo,
        }
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/book_dates/${companyId}`, {params, headers: this.ycHeaders}));
        return result;
    }

    async timeReservation(cookie: string, companyId: string, masterId: string, serviceId: string[], time: string): Promise<any> {
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
                  'Cookie': cookie,
                },
            }
        ).pipe(map(response => response.data)));
        return data;
    }

    async timeReservationMulti(cookie: string, companyId: string, masters: {masterId: string, serviceId: string[]}[], time: string): Promise<any> {

        const serviceIdList = masters.flatMap(master => master.serviceId);

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
        console.log(requestData);
        const formData = qs.stringify(requestData);

        const response =  await firstValueFrom(this.httpService.post('https://dikidi.ru/ru/mobile/ajax/newrecord/time_reservation_multi/', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                'Cookie': cookie,            
            },
            validateStatus: function (status) {
                return status < 500; // Разрешить все коды состояния, кроме 5xx
            }
        }));
         return response?.data;
    }

    async check(cookie: string, type: string, companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const params = {
            company_id: companyId,
            //session: session,
            social_key: ''
        };

        const formData = new FormData();
        formData.append('company', companyId);
        formData.append('type', type);
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
                    'Cookie': cookie,
                },
            }),
          );
        //console.log(response.headers);
        return response?.headers;
    }

    async record(cookie: string, type: string, companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
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

        const response = await firstValueFrom(
            this.httpService.post(`https://dikidi.ru/ru/ajax/newrecord/record/?company_id=${companyId}&social_key=`, formData, {
                params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'ru,en;q=0.9,be;q=0.8',
                    'Cookie': cookie,
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

    async removeRecord(recordId: string): Promise<any> {
        const params = {
            id: recordId
        };

        const data = lastValueFrom(this.httpService.get(`https://dikidi.ru/ru/mobile/newrecord/remove_record/`,
            {params}
        )
            .pipe(
                map(response => response.data)));
        return data
    }
}
