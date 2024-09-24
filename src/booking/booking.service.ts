import { Injectable } from '@nestjs/common';
import { DikidiService } from 'src/dikidi/dikidi.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto} from './dto/get-service.dto';
import { GetMasterFullInfoDto } from './dto/get-master-full-info.dto';
import { RequestGetDateTimesDto, RequestMasterServicesDateTimesDto } from './dto/request-get-date-times-multi.dto';
import { GetMasterServiceDatetimesMulti } from './dto/get-master-service-datetimes-multi.dto';
import { RequestRecordDto } from './dto/request-post-record.dto';
import { RequestGetDatesTrueDto } from './dto/request-get-dates-true.dto';
import { ResponseNewRecordDto } from './dto/response-new-record.dto';
import * as dayjs from 'dayjs';
import { YclientsService } from 'src/yclients/yclients.service';
import { RecordService } from 'src/record/record.service';
import { RequestUpdateRecordDto } from 'src/record/dto/request-update-record.dto';

@Injectable()
export class BookingService {
    constructor(private readonly dikidiService: DikidiService,
        private readonly yciletnService: YclientsService,
        private readonly recordService: RecordService,
    )
    {}

    async getCompany(companyId: string): Promise<GetCompanyDto | null> {
        const data =  (await this.yciletnService.getCompany(companyId)).data?.data;

        return {
            id: data?.id.toString(),
            name: data?.title,
            description: data?.short_descr,
            image: data?.logo,
            schedule: data?.schedule,
            phones: data?.phones,
            city: data?.city,
            address: data?.address,
            coordinateLat: data?.coordinate_lat,
            coordinateLon: data?.coordinate_lon,
            currencyShortTitle: data?.currency_short_title,
        };
    }

    async getMasters(companyId: string): Promise<GetMasterDto[] | []> {
        const data = (await this.yciletnService.getMasters(companyId)).data?.data;
        return data?.map(item => {
                return {
                    id: item?.id.toString(),
                    name: item?.name,
                    post: item?.specialization,
                    image: item?.avatar,
                    rating: item?.rating,
                    seanceDate: item?.seance_date,
                }
            });
    }

    async getServices(companyId: string): Promise<GetCategoryWithServiceDto> { 

        const data = (await this.yciletnService.getServices(companyId)).data?.data;

        return data?.category?.map(category => {
            return {
                id: category?.id.toString(),
                name: category?.title,
                services: data?.services?.filter(item => item?.category_id == category?.id).map(service  => {
                    return {
                        id: service?.id.toString(),
                        name: service?.title,
                        image: service?.image,
                        time: service?.seance_length,
                        priceMin: service?.price_min,
                        priceMax: service?.price_max,
                    }
                })
            }
        }) ;
    }

    async getMastersMulti(companyId: string, serviceId: string[]): Promise<GetMasterFullInfoDto[]> {
        const data = (await this.yciletnService.getMasters(companyId, serviceId)).data?.data;
        return Promise.all(data?.map(async item => {
            const masterServicesResponse = await this.yciletnService.getServices(companyId, item?.id);
            const masterServices = masterServicesResponse?.data?.data?.services;
            const currentServices = masterServices?.filter(service => serviceId.includes(service.id.toString()));
            console.log(currentServices.length)
            return {
                id: item?.id.toString(),
                name: item?.name,
                post: item?.specialization,
                description: null,
                image: item?.avatar,
                rating: item?.rating,
                seanceDate: item?.seance_date,
                services: currentServices?.map(service  => {
                    return {
                        id: service?.id.toString(),
                        name: service?.title,
                        image: service?.image,
                        time: service?.seance_length / 60,
                        priceMin: service?.price_min,
                        priceMax: service?.price_max,
                    }
                }),
                totalTimePriceInfo: {
                    totalDuration: currentServices?.reduce((acc, service) => acc + service.seance_length, 0) / 60 || 0,
                    totalPriceMin: currentServices?.reduce((acc, service) => acc + service.price_min, 0) || 0,
                    totalPriceMax: currentServices?.reduce((acc, service) => acc + service.price_max, 0) || 0,
                }
            };
        }));
    }

    async getMasterFullInfo(companyId: string, masterId: string): Promise<GetMasterFullInfoDto | null> {
        const master = (await this.yciletnService.getMasters(companyId)).data?.data?.find(item => item?.id == masterId);
        const services = (await this.yciletnService.getServices(companyId, masterId)).data?.data;

        return {
            id: master?.id.toString(),
            name: master?.name,
            post: master?.specialization,
            description: null,
            image: master?.avatar,
            rating: master?.rating,
            seanceDate: master?.seance_date,
            services: services?.services?.map(service  => {
                return {
                    id: service?.id.toString(),
                        name: service?.title,
                        image: service?.image,
                        time: service?.seance_length / 60,
                        priceMin: service?.price_min,
                        priceMax: service?.price_max,
                }
            })
        };
    }

    async getMasterServiceDatetimesMulti(companyId: string, body: RequestGetDateTimesDto): Promise<GetMasterServiceDatetimesMulti> {
        const data = (await this.yciletnService.getDatetimesMulti(companyId, body.masters[0].masterId, body.date, body.masters[0].serviceId)).data?.data;
        return {
            workData: {
                times: data?.map(item => item?.time)
            }
        };
    }

    async getDatesTrue(companyId: string, requestDatesTrue: RequestGetDatesTrueDto): Promise<any> {
        // const response =  await this.dikidiService.getDatesTrue(companyId, requestDatesTrue.masters, requestDatesTrue.dateFrom, requestDatesTrue.dateTo);
        // return response?.dates_true || [];
        const data = (await this.yciletnService.getDatesTrue(companyId, requestDatesTrue.masters[0].masterId, requestDatesTrue.masters[0].serviceId, requestDatesTrue.dateFrom, requestDatesTrue.dateTo)).data?.data;
        return data?.booking_dates;
    }

    async recordInfo(companyId: string, recordIdList: string[]): Promise<any> {
        const recordInfo =  (await this.dikidiService.recordsInfo(companyId, recordIdList));
        console.log(recordInfo);
        return recordInfo;
    }

    // async newRecord(companyId: string, recordInfo: RequestRecordDto): Promise<any> {
    //     let recordType = 'normal';
    //     let timeReservation;
    //     const cookieName = await this.dikidiService.getCookie();
    //     console.log('COOKIE_NAME - ' + cookieName);
    //     const cookie = process.env.COOKIE + cookieName; 
    //     if(recordInfo.masters.length == 1 && recordInfo.masters[0].serviceId.length == 1){
    //         timeReservation =  await this.dikidiService.timeReservation(cookie, companyId, recordInfo.masters[0].masterId, recordInfo.masters[0].serviceId, recordInfo.time);
    //         if(timeReservation?.error)
    //             return {error: timeReservation?.message};
    //     } else{
    //         recordType = 'multi';
    //         timeReservation =  await this.dikidiService.timeReservationMulti(cookie, companyId, recordInfo.masters, recordInfo.time);
    //         if(timeReservation?.error?.code !== 0)
    //             return {error: timeReservation.error?.message};
    //     }

    //     const check = await this.dikidiService.check(cookie, recordType, companyId, recordInfo.phone, recordInfo.firstName, recordInfo.comment);;

    //     const record =  await this.dikidiService.record(cookie, recordType, companyId, recordInfo.phone, recordInfo.firstName, recordInfo.comment);

    //     if(record?.error)
    //         return {error: record?.message};

    //     const recordData : ResponseNewRecordDto[] = record?.bookings?.map(item => {
    //         const data: ResponseNewRecordDto = {
    //             id: item?.id,
    //             time: item?.time,
    //             timeTo: item?.time_to,
    //             price: item?.cost,
    //             duration: item?.duration,
    //             durationString: item?.duration_string,
    //             // currency: {
    //             //     id: item?.currency?.id,
    //             //     title: item?.currency?.title,
    //             //     abbr: item?.currency?.abbr,
    //             //     iso: item?.currency?.iso,
    //             // },
    //             client: {
    //                 name: recordInfo?.firstName,
    //                 phone: recordInfo?.phone,
    //                 comment: recordInfo?.comment,
    //             },
    //             master: {
    //                 id: item?.employees[0]?.id,
    //                 name: item?.employees[0]?.username,
    //                 image: item?.employees[0]?.image,
    //             },
    //             services: item?.services?.map(service => {
    //                 return {
    //                     id: service?.id,
    //                     name: service?.name,
    //                     price: service?.cost,
    //                     duration: service?.duration,
    //                     durationString: service?.duration_string,
    //                     image: service?.icon?.value,
    //                 }
    //             })
    //         } 
    //         return data;
    //     })
    //     return recordData.sort((a, b) => a.id.localeCompare(b.id));;
    // }

    async newRecord(companyId: string, recordInfo: RequestRecordDto): Promise<any> {
        const check = await this.yciletnService.check(companyId, recordInfo.masters[0].masterId, recordInfo.time, recordInfo.masters[0].serviceId);
        if(check.status != 201) return check;
        const record =  await this.yciletnService.record(companyId, recordInfo.phone, recordInfo.firstName, recordInfo.masters[0].masterId, recordInfo.time, recordInfo.masters[0].serviceId, recordInfo.comment);
        return record;
    }

    async removeRecord(companyId: string, recordId: string): Promise<any> {
        const currentRecrodInfo = await this.recordService.getById(companyId, recordId);
        if(!currentRecrodInfo) return {error: 'Запись не найдена'};

        const removeRecordFromService = await this.yciletnService.removeRecord(companyId, currentRecrodInfo.extRecordId, currentRecrodInfo.extRecordHash);
        console.log('delete yc status - ' + removeRecordFromService.status);
        if(removeRecordFromService.status != 204) return {error: 'Ошибка удаления записи'};

        const removeRecord =  await this.recordService.remove(companyId, currentRecrodInfo.id);
        return currentRecrodInfo;
    }

    async transferRecord(companyId: string, data: RequestUpdateRecordDto): Promise<any> {
        const currentRecrodInfo = await this.recordService.getById(companyId, data.id);
        if(!currentRecrodInfo) return {error: 'Запись не найдена'};

        const transferRecordFromService = await this.yciletnService.recordTransfer(companyId, currentRecrodInfo.extRecordId, currentRecrodInfo.extRecordHash, data.datetime, data?.comment);
        console.log('transfer yc status - ' + transferRecordFromService.status);
        if(transferRecordFromService.status != 200) return {error: 'Ошибка удаления записи'};

        const updateRecors =  await this.recordService.update(companyId, data);
        return updateRecors;
    }
}
