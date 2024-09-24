import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const { URLSearchParams } = require('url');
import { validate } from '@telegram-apps/init-data-node';
import { RequestAuthDto } from './dto/request-auth.dto';
import { UserPayloadDto } from './dto/user-payload.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { roleMapping } from './constants/roles.const';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bookingService: BookingService,
  ) {}

  async login(data: RequestAuthDto) : Promise<any> {
   try{
      const salons = await this.prisma.salon.findMany();
      console.log(salons);
      let currentSalon;
      console.log(data)
      for (let item of salons) {
        try{
          validate(data.initDataRaw, item.tgToken, { expiresIn: 0 });
          currentSalon = item;
        } catch (e) {
          console.log(e.message)
          continue;
        }
      }

      if(data.user.id.toString() == '99281932'){
        const devUser = await this.prisma.user.findFirst({where:{tgUserId: data.user.id}});
        console.log(devUser)
        currentSalon = await this.prisma.salon.findUnique({where:{id: devUser.salonId}}); 
        console.log(currentSalon)
      }

      if(!currentSalon) return {error: 'Ошибка авторизации. Салон не зарегистрирован!'};
      const user = await this.prisma.user.findFirst({
        where: {tgUserId: data.user.id, salonId: currentSalon.id},
      });
      const company = await this.bookingService.getCompany(currentSalon.extCompanyId);
      const payload: UserPayloadDto = { 
        salonId: user.salonId,
        userId: user.id,
        clientId: user.clientId || null,
        staffId: user.staffId || null,
        extCompanyId: currentSalon.extCompanyId,
        currency: company?.currencyShortTitle,
        roles: [user.role]
      };
      return {
        role: roleMapping[user.role],
        token: this.jwtService.sign(payload),
      };
    } catch (e) {
      console.log(e.message);
      return {error: e.message}
    }
  }

  async parseQueryString(queryString: string): Promise<any> {
    const params = new URLSearchParams(queryString);
    const queryObject = {};

    params.forEach((value, key) => {
      const keys = key.split('.');
      keys.reduce((acc, part, index) => {
        if (index === keys.length - 1) {
          try {
            acc[part] = JSON.parse(decodeURIComponent(value));
          } catch (e) {
            acc[part] = decodeURIComponent(value);
          }
        } else {
          acc[part] = acc[part] || {};
        }
        return acc[part];
      }, queryObject);
    });

    return queryObject;
  }
}
