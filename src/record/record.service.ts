import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateRecordDto } from './dto/request-cretate-record.dto';
import { DikidiService } from 'src/dikidi/dikidi.service';
import { ResponseGetRecordFullInfoDto } from './dto/response-get-record-short-info.dto';
import { GetMasterFullInfoDto } from 'src/booking/dto/get-master-full-info.dto';
import { ResponseGetRecordShortInfoDto } from './dto/response-get-record-full-info.dto';

@Injectable()
export class RecordService {
    constructor(
        private prisma: PrismaService,
        private dikidiService: DikidiService,
    ) {}

    async create(data: RequestCreateRecordDto): Promise<any> {
        console.log(data)
        const record = await this.prisma.record.create({
            data: {
              clientId: data.clientId,
              dkdRecordId: data.dkdRecordId,
              dkdDate: data.dkdDate,
              clientName: data.clientName,
              clientPhone: data.clientPhone,
              clientComment: data.clientComment,
              ycRecordData:  JSON.parse(data.recordInfo),
              staffId: data.staffId,
            }
          });
        return record;
    }

    async getClientRecordsList(companyId: string, clientId: string, date: string): Promise<ResponseGetRecordShortInfoDto[]> {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
    
        const result = await this.prisma.record.findMany({
            where: {
                clientId: clientId,
                dkdDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            orderBy: {
                dkdDate: 'asc',
            },
        });
    
        return result.map(item => {
            const recordIndo: GetMasterFullInfoDto = item?.ycRecordData as GetMasterFullInfoDto;
            return {
                id: item.id,
                ycRecordId: item?.dkdRecordId,
                clientName: item?.clientName,
                clientPhone: item?.clientPhone,
                clientComment: item?.clientComment,
                datetime: item?.dkdDate.toISOString().slice(0, 16).replace('T', ' '),
                duration: recordIndo?.totalTimePriceInfo?.totalDuration,
                masterName: recordIndo?.name,
                masterImage: recordIndo?.image,
                servicesName: recordIndo?.services?.map(service => service?.name),
                currency: recordIndo?.currency,
                totalPriceMin: recordIndo?.totalTimePriceInfo?.totalPriceMin,
                totalPriceMax: recordIndo?.totalTimePriceInfo?.totalPriceMax,
            }
        });
    }

    async getById(companyId: string, id: string): Promise<ResponseGetRecordFullInfoDto | null> {
        const result = await this.prisma.record.findUnique({where: {id}});
        if(!result) return null;
        return {
            id: result?.id,
            ycRecordId: result?.dkdRecordId,
            clientName: result?.clientName,
            clientPhone: result?.clientPhone,
            clientComment: result?.clientComment,
            datetime: result?.dkdDate.toISOString().slice(0, 16).replace('T', ' '),
            master: result?.ycRecordData as GetMasterFullInfoDto,
        };
    }

    async GetRecordsDatesTrue(companyId: string, dateFrom: string, dateTo: string): Promise<string[]> {
        // Добавляем один день к dateTo
        const adjustedDateTo = new Date(dateTo);
        adjustedDateTo.setDate(adjustedDateTo.getDate() + 1);
      
        const uniqueDates = await this.prisma.record.findMany({
          where: {
            dkdDate: {
              gte: new Date(dateFrom),
              lt: adjustedDateTo, // Используем lt для включения dateTo
            },
          },
          select: {
            dkdDate: true,
          },
          distinct: ['dkdDate'],
        });
      
        const formattedDates = uniqueDates.map(record => 
          record.dkdDate.toISOString().split('T')[0]
        );
      
        return formattedDates;
      }
    

    async getMasterRecords(staffId: string): Promise<any> {
        const record =  await this.prisma.record.findMany(
            {
                where: {staffId},
                orderBy: [
                    {
                      dkdRecordId: 'asc',
                    },
                  ],
            });
        return record;
    }
}
