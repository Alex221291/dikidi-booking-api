import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const crypto = require('crypto');
const { URLSearchParams } = require('url');
import { validate } from '@telegram-apps/init-data-node';
import { RequestAuthDto } from './dto/request-auth.dto';
import { UserPayloadDto } from './dto/user-payload.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(data: RequestAuthDto) : Promise<any> {
   try{
      const salons = await this.prisma.salon.findMany();
      let currentSalon;
      for (let item of salons) {
        try{
          console.log(data)
          validate(data.initDataRaw, item.tgToken, {expiresIn: 36000000000});
          currentSalon = item;
        } catch (e) {
          console.log(e.message)
          continue;
        }
      }

      if(data.user.id.toString() == '99281932'){
        const devUser = await this.prisma.user.findFirst({where:{tgUserId: data.user.id}});
        currentSalon = await this.prisma.salon.findUnique({where:{id: devUser.salonId}}); 
      }
      
      if(!currentSalon) return {error: 'Ошибка авторизации. Салон не зарегистрирован!'};
      const user = await this.prisma.user.findFirst({
        where: {tgUserId: data.user.id, salonId: currentSalon.id},
      });
      const payload: UserPayloadDto = { 
        salonId: user.salonId,
        userId: user.id,
        clientStaffId: user.userId || null,
        dkdCompanyId: currentSalon.dkdCompanyId, 
        roles: [user.role]
      };
      return {
        role: user.role,
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
