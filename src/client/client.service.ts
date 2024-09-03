import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateCLientDto } from './dto/request-cretate-client.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class ClientService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async getClientUser(userId: string, clientId?: string): Promise<any> {
        const client =  await this.prisma.user.findUnique({where:{id: userId}});
        return client;
    }

    async create(data: RequestCreateCLientDto): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: {id: data.userId}, 
        });

        if(user?.userId) return {};

        const client =  await this.prisma.client.create({data:{name: data.name, phone: data.phone}});
        const updateUser = await this.prisma.user.update({
            where: {id: data.userId}, 
            data:{
                userId: client.id,
                role: $Enums.UserRoles.CLIENT
            }
        });
        return client;
    }
}