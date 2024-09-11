import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateRecordDto } from './dto/request-cretate-record.dto';
import { DikidiService } from 'src/dikidi/dikidi.service';

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

    async getClientRecords(companyId: string, clientId: string): Promise<any> {
        const records =  await this.prisma.record.findMany({
            where: {clientId}, 
            orderBy: [
                {
                  dkdRecordId: 'asc',
                },
            ],
        });
        const dkdRecordIdList = records.map(item => item.dkdRecordId);
        const dkdRecords =  await this.dikidiService.recordsInfo(companyId, dkdRecordIdList)

        return dkdRecordIdList;
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
