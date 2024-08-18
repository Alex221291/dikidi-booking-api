import { Injectable } from '@nestjs/common';
import { DikidiService } from 'src/dikidi/dikidi.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto, GetServiceDto } from './dto/get-service.dto';
import { GetMasterServiceDatetimes } from './dto/get-master-service-datetimes.dto';
import { GetMasterFullInfoDto } from './dto/get-master-full-info.dto';

@Injectable()
export class BookingService {
    constructor(private dikidiService: DikidiService)
    {}

    async getCompany(companyId: number): Promise<GetCompanyDto | null> {
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

    async getMasters(companyId: number): Promise<GetMasterDto[] | []> {
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

    async getServices(companyId: number): Promise<GetCategoryWithServiceDto> {
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
                        price: service?.price,
                    }
                })
            }
        }) ;
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getMastersFullInfo(companyId: number): Promise<GetMasterFullInfoDto[] | []> {
        const data =  await this.dikidiService.getMasters(companyId);

        const masterIds = data?.masters_order;

        const masters =  Promise.all(masterIds?.map(async item => {
            await this.delay(1000);
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
                        price: service?.price,
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

    async getMasterFullInfo(companyId: number, masterId: number): Promise<GetMasterFullInfoDto | null> {
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
                    image: service?.image,
                    time: service?.time,
                    price: service?.price,
                }
            })
        };
        return master;
    }

    async getMasterServiceDatetimes(companyId: number, masterId: number, serviceId: number, date: string): Promise<GetMasterServiceDatetimes> {
        const masterDatetimes =  (await this.dikidiService.getDatetimes(companyId, masterId, serviceId, date))?.data;
        return {
            id: masterDatetimes?.masters[masterId]?.id,
            name: masterDatetimes?.masters[masterId]?.username,
            image: masterDatetimes?.masters[masterId]?.image,
            serviceName: masterDatetimes?.masters[masterId]?.service_name,
            serviceImage: masterDatetimes?.masters[masterId]?.service_image,
            price: masterDatetimes?.masters[masterId]?.price,
            time: masterDatetimes?.masters[masterId]?.time,
            workData:{
                dateTrue: masterDatetimes?.dates_true,
                dateNear: masterDatetimes?.date_near,
                times: masterDatetimes?.times[masterId],
            }
        };;
    }
}
