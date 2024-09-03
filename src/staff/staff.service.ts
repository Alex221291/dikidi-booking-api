import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async getMasterUser(dkdMasterId: string): Promise<any> {
        const staff =  await this.prisma.staff.findFirst({where:{dkdMasterId}});
        const master =  await this.prisma.user.findFirst({where:{userId: staff.id}});
        return master;
    }

    // async create(data: RequestCreateCLientDto): Promise<any> {
    //     const client =  await this.prisma.client.create({data:{name: data.name, phone: data.phone}});
    //     const user = await this.prisma.user.update({
    //         where: {id: data.userId}, 
    //         data:{userId: client.id}
    //     });
    //     return client;
    // }
}
