import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateSalonDto } from './dto/request-cretate-salon.dto';

@Injectable()
export class SalonService {
    constructor(
        private prisma: PrismaService,
    ) {}

    
    async getOne(id: string): Promise<any> {
        const salon =  await this.prisma.salon.findUnique({where:{id}});
        return salon;
    }

    async create(data: RequestCreateSalonDto): Promise<any> {
        const salon =  await this.prisma.salon.create({data});
        return JSON.parse(JSON.stringify(salon, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value
        ));
    }

    async getAll(): Promise<any> {
        const salons =  await this.prisma.salon.findMany();
        return JSON.parse(JSON.stringify(salons, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value
        ));
    }
}
