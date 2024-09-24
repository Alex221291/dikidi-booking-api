import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestCreateStaffDto } from './dto/request-cretate-staff.dto';
import { TelegramChatService } from 'src/telegram/telegram-chat.service';

@Injectable()
export class StaffService {
    constructor(
        private prisma: PrismaService,
        private telegramChatService: TelegramChatService,
    ) {}

    async getMasterUser(extMasterId: string): Promise<any> {
        const staff =  await this.prisma.staff.findFirst({where:{extMasterId}});
        if(!staff) return null;
        const master =  await this.prisma.user.findFirst({where:{staffId: staff?.id}});
        return master;
    }

    async getSalonAdministratorsUser(salonId: string): Promise<any> {
        const salonAdminisrators =  await this.prisma.user.findMany({where:{salonId, role: $Enums.UserRoles.ADMINISTRATOR}});
        return salonAdminisrators;
    }

    async createStaff(data: RequestCreateStaffDto): Promise<any> {
        let staffId;
        if(data.role == $Enums.UserRoles.MASTER){
            const staff =  await this.prisma.staff.create({data:{extMasterId: data.extMasterId}});
            staffId = staff.id; 
        }
        const user = await this.prisma.user.update({
            where: {id: data.appUserId}, 
            data:{
                role: data.role,
                staffId: staffId || null}
        });

        const salon = await this.prisma.salon.findUnique({where:{id: user.salonId}})
        await this.telegramChatService.sendMessage(salon.tgToken, user.tgChatId.toString(), `Ваша раоль изменена на - ${data.role}`);

        return JSON.parse(JSON.stringify(user, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value
        ));
    }

    async getStaff(salonId: string): Promise<any> {
        const staff =  await this.prisma.user.findMany({
            where:{AND:{NOT: {
                OR: [
                    {role: $Enums.UserRoles.USER},
                    {role: $Enums.UserRoles.CLIENT},
                  ],
              },
                salonId}}
            });
        return JSON.parse(JSON.stringify(staff, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value
        ));
    }
}
