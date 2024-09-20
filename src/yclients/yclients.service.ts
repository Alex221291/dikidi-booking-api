import { Injectable } from '@nestjs/common';
import { HttpService} from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';
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

    async getMasters(companyId: string, serviceIds?: string[], datetime?: string): Promise<AxiosResponse<any, any>> {
        const params = {
            service_ids: serviceIds,
            datetime: datetime
        }
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/book_staff/${companyId}`, {headers: this.ycHeaders, params}));
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

    async getServicesPriceDuration(companyId: string, staffId?: string, serviceIds?: string[]): Promise<AxiosResponse<any, any>> {
        const params = {
            staff_id: staffId,
            service_ids: serviceIds
        }
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/booking/locations/${companyId}/search/services/`, {params, headers: this.ycHeaders}));
        return result;
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

    async check(companyId: string, staffId: string, datetime: string, serviceId?: string[]): Promise<any> {

        const body = {
            appointments : [{
                id: 1,
                staff_id: staffId,
                datetime: datetime,
                services: serviceId,
            }]
        };
        //const formData = qs.stringify(requestData);

        const result =  await lastValueFrom(this.httpService.post(`https://api.yclients.com/api/v1/book_check/${companyId}`, body, {
            headers: this.ycHeaders,
            validateStatus: function (status) {
                return status < 500; // Разрешить все коды состояния, кроме 5xx
            }
        }));
         return result;
    }

    async record(companyId: string, phone: string, fullName: string, staffId: string, datetime: string, serviceId?: string[], comment?: string): Promise<any> {
        const appointments = [{
            id: 1,
            staff_id: staffId,
            datetime: datetime,
            services: serviceId,
        }];
        //const formData = qs.stringify(requestData);
        const body = {
            phone,
            fullname: fullName,
            comment,
            email: '',
            appointments,
        }
        const result =  await lastValueFrom(this.httpService.post(`https://api.yclients.com/api/v1/book_record/${companyId}`, body, {
            headers: this.ycHeaders,
            validateStatus: function (status) {
                return status < 500; // Разрешить все коды состояния, кроме 5xx
            }
        }));
         return result;
    }

    async recordsInfo(companyId: string, recordId: string, recordHash: string): Promise<any> {
        const result = lastValueFrom(this.httpService.get(`https://api.yclients.com/api/v1/book_record/${companyId}/${recordId}/${recordHash}`,
            {
                headers: this.ycHeaders,
                validateStatus: function (status) {
                    return status < 500; // Разрешить все коды состояния, кроме 5xx
                }},
        ));
        return result;
    }

    async recordTransfer(companyId: string, recordId: string, recordHash: string, datetime: string, comment?: string): Promise<any> {
        const body = {
            datetime: datetime,
            comment: comment,
        };

        const result = lastValueFrom(this.httpService.put(`https://api.yclients.com/api/v1/book_record/${companyId}/${recordId}/${recordHash}`,
            body,
            {
                headers: this.ycHeaders,
                validateStatus: function (status) {
                    return status < 500; // Разрешить все коды состояния, кроме 5xx
                }},
        ));
        const awaitres = await result;
        console.log(awaitres.status);
        console.log(awaitres.data);
        return result;
    }


    async removeRecord(companyId: string, recordId: string, recordHash: string): Promise<any> {
        const result = lastValueFrom(this.httpService.delete(`https://yclients.com/api/v1/user/records/${recordId}/${recordHash}`,
            {
                headers: this.ycHeaders,
                validateStatus: function (status) {
                    return status < 500; // Разрешить все коды состояния, кроме 5xx
                }
            },
        ));
        return result;
    }
}
