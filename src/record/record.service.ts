import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateRecordDto } from './dto/request-cretate-record.dto';
import { DikidiService } from 'src/dikidi/dikidi.service';
import { ResponseGetRecordFullInfoDto } from './dto/response-get-record-full-info.dto';
import { GetMasterFullInfoDto } from 'src/booking/dto/get-master-full-info.dto';
import { ResponseGetRecordShortInfoDto } from './dto/response-get-record-short-info.dto';
import { RequestUpdateRecordDto } from './dto/request-update-record.dto';
import * as dayjs from 'dayjs';

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
              extRecordId: data.extRecordId,
              extRecordHash: data?.extRecordHash,
              extDate: data.extDate,
              clientName: data.clientName,
              clientPhone: data.clientPhone,
              clientComment: data.clientComment,
              extRecordData:  JSON.parse(data.recordInfo),
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
                extDate: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            orderBy: {
                extDate: 'asc',
            },
        });
    
        return result.map(item => {
            const recordIndo: GetMasterFullInfoDto = item?.extRecordData as GetMasterFullInfoDto;
            return {
                id: item.id,
                extRecordId: item?.extRecordId,
                clientName: item?.clientName,
                clientPhone: item?.clientPhone,
                clientComment: item?.clientComment,
                datetime: dayjs(item?.extDate).format('YYYY-MM-DD HH:mm'),
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
            extRecordId: result?.extRecordId,
            extRecordHash: result?.extRecordHash,
            clientName: result?.clientName,
            clientPhone: result?.clientPhone,
            clientComment: result?.clientComment,
            datetime: dayjs(result?.extDate).format('YYYY-MM-DD HH:mm'),
            master: result?.extRecordData as GetMasterFullInfoDto,
        };
    }

    async GetRecordsDatesTrue(companyId: string, clientId: string, dateFrom: string, dateTo: string): Promise<string[]> {
        // Добавляем один день к dateTo
        const adjustedDateTo = new Date(dateTo);
        adjustedDateTo.setDate(adjustedDateTo.getDate() + 1);
      
        const uniqueDates = await this.prisma.record.findMany({
          where: {
            extDate: {
              gte: new Date(dateFrom),
              lt: adjustedDateTo, // Используем lt для включения dateTo
            },
            clientId: clientId,
          },
          select: {
            extDate: true,
          },
          distinct: ['extDate'],
        });
      
        const formattedDates = uniqueDates.map(record => 
          record.extDate.toISOString().split('T')[0]
        );
      
        return formattedDates;
      }
    

    async getMasterRecords(staffId: string): Promise<any> {
        const record =  await this.prisma.record.findMany(
            {
                where: {staffId},
                orderBy: [
                    {
                      extRecordId: 'asc',
                    },
                  ],
            });
        return record;
    }

    async update(companyId: string, data: RequestUpdateRecordDto): Promise<any> {
      const result = await this.prisma.record.findUnique({where: {id: data.id}});
      if(!result) return null;
      const record = await this.prisma.record.update({where:{id: result.id},
          data: {
            extDate: new Date(data.datetime).toISOString(),
            clientComment: data.comment,
          }
        });
      return {
        id: record?.id,
        extRecordId: record?.extRecordId,
        extRecordHash: record?.extRecordHash,
        clientName: record?.clientName,
        clientPhone: record?.clientPhone,
        clientComment: record?.clientComment,
        datetime: dayjs(record?.extDate).format('YYYY-MM-DD HH:mm'),
        master: record?.extRecordData as GetMasterFullInfoDto,
      };
    }

    async remove(companyId: string, recordId: string): Promise<any> {
      const result = await this.prisma.record.delete({where: {id: recordId}});
      return result;
    }
}
