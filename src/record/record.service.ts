import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateRecordDto } from './dto/request-cretate-record.dto';

@Injectable()
export class RecordService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async create(data: RequestCreateRecordDto): Promise<any> {
        const record =  await this.prisma.record.create({data});
        return record;
    }

    async getClientRecords(clientId: string): Promise<any> {
        const record =  await this.prisma.record.findMany({
            where: {clientId}, 
            orderBy: [
                {
                  dkdRecordId: 'asc',
                },
              ],
            });
        return record;
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
