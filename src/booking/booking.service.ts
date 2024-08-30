import { Injectable } from '@nestjs/common';
import { DikidiService } from 'src/dikidi/dikidi.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto} from './dto/get-service.dto';
import { GetMasterServiceDatetimes, MasterDatetimesInfo } from './dto/get-master-service-datetimes.dto';
import { GetMasterFullInfoDto } from './dto/get-master-full-info.dto';
import { RequestMasterServicesDateTimesDto } from './dto/request-get-date-times-multi.dto';
import { GetMasterServiceDatetimesMulti, MasterInfo, ServiceInfo } from './dto/get-master-service-datetimes-multi.dto';
import { RequestRecordDto } from './dto/request-post-record.dto';
import { RequestGetDatesTrueDto } from './dto/request-get-dates-true.dto';
import { ResponseNewRecordDto } from './dto/response-new-record.dto';
import { GetMastersMultiDto, MasterMultiInfo } from './dto/get-master-multi.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class BookingService {
    constructor(private dikidiService: DikidiService)
    {}

    async getCompany(companyId: string): Promise<GetCompanyDto | null> {
        const data =  await this.dikidiService.getCompany(companyId);
        const company = data?.data?.company;

        return {
            id: company?.id,
            name: company?.name,
            description: company?.description,
            image: company?.image,
            phones: company?.phones,
            address: company?.address,
            currencyAbbr: company?.currency_abbr,
            schedule: company?.schedule?.map(item => {
                return {
                    day: item?.day,
                    workFrom: item?.work_from,
                    workTo: item?.work_to,
                }
            })
        };
    }

    async getMasters(companyId: string): Promise<GetMasterDto[] | []> {
        const data =  await this.dikidiService.getMasters(companyId);

        return data?.masters_order?.map(item => {
            return {
                id: data?.masters[item]?.id,
                name: data?.masters[item]?.username,
                post: data?.masters[item]?.post,
                image: data?.masters[item]?.image,
            }
        });
    }

    async getServices(companyId: string): Promise<GetCategoryWithServiceDto> {
        const data =  await this.dikidiService.getServices(companyId);
        const categories = data?.data?.list;

        return categories?.map(category => {
            return {
                id: category?.id,
                name: category?.name,
                services: category?.services?.map(service  => {
                    return {
                        id: service?.id,
                        name: service?.name,
                        image: service?.image,
                        time: service?.time,
                        price: service?.cost,
                    }
                })
            }
        }) ;
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getMastersFullInfo(companyId: string): Promise<GetMasterFullInfoDto[] | []> {
        const data =  await this.dikidiService.getMasters(companyId);

        const masterIds = data?.masters_order;

        const masters =  Promise.all(masterIds?.map(async item => {
            const masterData = (await this.dikidiService.getMaster(companyId, item))?.data;
            console.log(masterData.id);
            const master: GetMasterFullInfoDto = {
                id: masterData?.id,
                name: masterData?.username,
                post: masterData?.post,
                description: masterData?.description,
                image: masterData?.image,
                currency: {
                    id: masterData?.currency?.id,
                    title: masterData?.currency?.title,
                    abbr: masterData?.currency?.abbr,
                    iso: masterData?.currency?.iso,
                },
                gallery: masterData?.gallery?.map(gal  => {
                    return {
                        big: gal?.big,
                        zoom: gal?.zoom,
                    }
                }),
                services: await Promise.all(masterData?.services?.map(async service  => {
                    //console.log(masterData.id + ' - ' + service.id);
                    await this.delay(1000);
                    //const serviceDateTimes = await this.dikidiService.getDatetimes(companyId, masterData?.id, service?.id, '');
                    return {
                        id: service?.id,
                        name: service?.name,
                        image: service?.image,
                        time: service?.time,
                        price: service?.cost,
                        //dateTrue: serviceDateTimes?.data?.dates_true,
                        //dateNear: serviceDateTimes?.data?.date_near,
                        //times: serviceDateTimes?.data?.times[masterData?.id],
                    }
                }))
            };
            return master;
        }));
        return masters;
    }

    async getMastersMulti(companyId: string, serviceId: string[]): Promise<any> {
        const data =  (await this.dikidiService.getMastersMulti(companyId, serviceId))?.data;
        return serviceId.map(item => {
            const mastersData: MasterMultiInfo[] = [];
            for (let key in data[item]?.masters) {
                mastersData.push({
                    masterId: key,
                    masterName: data[item]?.masters[key]?.master_name,
                    masterImage: data[item]?.masters[key]?.master_img,
                    serviceName: data[item]?.masters[key]?.service_name,
                    serviceImage: data[item]?.masters[key]?.service_img,
                    time: data[item]?.masters[key]?.time,
                    cost: data[item]?.masters[key]?.cost,
                    currency: data[item]?.masters[key]?.currency?.abbr
                });
            }
            
            const serviceData: GetMastersMultiDto = {
                serviceId: data[item]?.service_id,
                masters: mastersData
            }
            return serviceData;
        });
    }

    async getMasterFullInfo(companyId: string, masterId: string): Promise<GetMasterFullInfoDto | null> {
        const masterData = (await this.dikidiService.getMaster(companyId, masterId))?.data;
        const master: GetMasterFullInfoDto = {
            id: masterData?.id,
            name: masterData?.username,
            post: masterData?.post,
            description: masterData?.description,
            image: masterData?.image,
            currency: {
                id: masterData?.currency?.id,
                title: masterData?.currency?.title,
                abbr: masterData?.currency?.abbr,
                iso: masterData?.currency?.iso,
            },
            gallery: masterData?.gallery?.map(gal  => {
                return {
                    big: gal?.big,
                    zoom: gal?.zoom,
                }
            }),
            services: masterData?.services?.map(service  => {
                return {
                    id: service?.id,
                    name: service?.name,
                    image: service?.icon?.url,
                    time: service?.time,
                    price: service?.cost,
                }
            })
        };
        return master;
    }

    async getMasterServiceDatetimes(companyId: string, serviceId: string, date: string, masterId?: string): Promise<GetMasterServiceDatetimes> {
        const data =  (await this.dikidiService.getDatetimes(companyId, masterId, serviceId, date))?.data;
        const mastersData: MasterDatetimesInfo[] = [];
            for (let key in data?.masters) {
                mastersData.push({
                    masterId: data?.masters[key]?.id,
                    masterName: data?.masters[key]?.username,
                    masterImage: data?.masters[key]?.image,
                    serviceName: data?.masters[key]?.service_name,
                    serviceImage: data?.masters[key]?.service_img,
                    time: data?.masters[key]?.time,
                    price: data?.masters[key]?.cost,
                    currency: data?.currency?.currency_abbr,
                    times: data?.times[key]?.map(item => {
                        const timeFormat= dayjs(item).format('HH:mm');
                        return timeFormat;
                    }),
                });}
        return {
            serviceId: serviceId,
            masters: mastersData,
            workData:{
                dateNear: data?.date_near,
                dateTrue: data?.dates_true,
            }

        };
    }

    async getMasterServiceDatetimesMulti(companyId: string, masters: RequestMasterServicesDateTimesDto[], date:string): Promise<GetMasterServiceDatetimesMulti> {
        const dikidiDatetimesMulti =  (await this.dikidiService.getDatetimesMulti(companyId, masters, date))?.data;

        const serviceIdString =  (masters.reduce((acc, master) => {
            return acc.concat(master.serviceId);
        }, [])).join(',');

        let result: GetMasterServiceDatetimesMulti = {
            masterInfo: [],
            workData: {
                dateNear: dikidiDatetimesMulti?.service_list[serviceIdString]?.date_near,
                dateTrue: dikidiDatetimesMulti?.service_list[serviceIdString]?.dates_true?.map(item => item?.day),
                times: dikidiDatetimesMulti?.service_list[serviceIdString]?.times.flat(),
            }
        };

        result.masterInfo = masters.map(item => {
            const serviceInfo: ServiceInfo[] = item.serviceId.map(service => {
                return {
                    id: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[service]?.service_id,
                    name: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[service]?.service_name,
                    image: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[service]?.service_img,
                    time: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[service]?.time,
                    price: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[service]?.cost,
                }
            });
            return {
                id: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[item.serviceId[0]]?.id,
                name: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[item.serviceId[0]]?.username,
                image: dikidiDatetimesMulti?.service_list[serviceIdString]?.master_service_info[item.serviceId[0]]?.image,
                serviceInfo: serviceInfo,
            };

        });
        return result;
    }

    async getDatesTrue(companyId: string, requestDatesTrue: RequestGetDatesTrueDto): Promise<string[]> {
        const response =  await this.dikidiService.getDatesTrue(companyId, requestDatesTrue.masters, requestDatesTrue.dateFrom, requestDatesTrue.dateTo);
        return response?.dates_true || [];
    }

    // async timeReservation(companyId: string, masterId: string, serviceId: string[], time: string): Promise<any> {
    //     const reservation =  (await this.dikidiService.timeReservation(companyId, masterId, serviceId, time));
    //     return reservation;
    // }

    // async timeReservationMulti(companyId: string, recordInfo: RequestRecordDto): Promise<any> {
    //     const reservation =  await this.dikidiService.timeReservationMulti(companyId, recordInfo.masters, recordInfo.time);
    //     return reservation;
    // }

    async check(companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const checkStatus = await this.dikidiService.check('normal', companyId, phone, firstName, comment);
        return checkStatus['set-cookie'];// == 200 ? true : false;
    }

    async record(companyId: string, phone: string, firstName: string, comment?: string): Promise<any> {
        const record =  (await this.dikidiService.record('normal', companyId, phone, firstName, comment));
        console.log(record);
        return record;
    }

    async recordInfo(companyId: string, recordIdList: string[]): Promise<any> {
        const recordInfo =  (await this.dikidiService.recordsInfo(companyId, recordIdList));
        console.log(recordInfo);
        return recordInfo;
    }

    async newRecord(companyId: string, recordInfo: RequestRecordDto): Promise<any> {
        let recordType = 'normal';
        let timeReservation;
        const cookieName = await this.dikidiService.getCookie();
        const cookie = process.env.COOKIE + cookieName; 
        if(recordInfo.masters.length == 1 && recordInfo.masters[0].serviceId.length == 1){
            timeReservation =  await this.dikidiService.timeReservation(cookie, companyId, recordInfo.masters[0].masterId, recordInfo.masters[0].serviceId, recordInfo.time);
            if(timeReservation?.error)
                return {error: timeReservation?.message};
        } else{
            recordType = 'multi';
            timeReservation =  await this.dikidiService.timeReservationMulti(cookie, companyId, recordInfo.masters, recordInfo.time);
            if(timeReservation?.error?.code !== 0)
                return {error: timeReservation.error?.message};
        }

        const check = await this.dikidiService.check(cookie, recordType, companyId, recordInfo.phone, recordInfo.firstName, recordInfo.comment);;

        const record =  await this.dikidiService.record(cookie, recordType, companyId, recordInfo.phone, recordInfo.firstName, recordInfo.comment);

        if(record?.error)
            return {error: record?.message};

        const recordData : ResponseNewRecordDto[] = record?.bookings?.map(item => {
            const data: ResponseNewRecordDto = {
                id: item?.id,
                time: item?.time,
                timeTo: item?.time_to,
                price: item?.cost,
                duration: item?.duration,
                durationString: item?.duration_string,
                currency: {
                    id: item?.currency?.id,
                    title: item?.currency?.title,
                    abbr: item?.currency?.abbr,
                    iso: item?.currency?.iso,
                },
                master: {
                    id: item?.employees[0]?.id,
                    name: item?.employees[0]?.username,
                    image: item?.employees[0]?.image,
                },
                services: item?.services?.map(service => {
                    return {
                        id: service?.id,
                        name: service?.name,
                        price: service?.cost,
                        duration: service?.duration,
                        durationString: service?.duration_string,
                        image: service?.icon?.value,
                    }
                })
            } 
            return data;
        })
        return { recordData, timeReservation};
    }
}
