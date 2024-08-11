import { Injectable } from '@nestjs/common';
import { DikidiService } from 'src/dikidi/dikidi.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto, GetServiceDto } from './dto/get-service.dto';
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

    async getMastersFullInfo(companyId: number): Promise<GetMasterFullInfoDto[] | []> {
        const data =  await this.dikidiService.getMasters(companyId);

        const masterIds = data?.masters_order;

        return Promise.all(masterIds?.map(async item => {
            const masterData = (await this.dikidiService.getMaster(companyId, item))?.data;

            const master: GetMasterFullInfoDto = {
                id: masterData?.id,
                name: masterData?.name,
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
        }));
    }

    async getMaster(companyId: number, masterId: number): Promise<any> {
        const result =  await this.dikidiService.getMaster(companyId, masterId);
        return result;
    }

    async getDatetimes(companyId: number, masterId: number, serviceId: number, date: string): Promise<any> {
        const result =  await this.dikidiService.getDatetimes(companyId, masterId, serviceId, date);
        return result;
    }
}
