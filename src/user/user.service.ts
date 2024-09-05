import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async getAll(salonId: string): Promise<any> {
        const users =  await this.prisma.user.findMany({where:{salonId}});
        return JSON.parse(JSON.stringify(users, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value
        ));;
    }
}
