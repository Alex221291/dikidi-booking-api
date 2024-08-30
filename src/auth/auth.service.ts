import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
//import { UsersService } from '../users/users.service';
const crypto = require('crypto');
const { URLSearchParams } = require('url');
import { validate, parse, type InitDataParsed } from '@telegram-apps/init-data-node';
import { ExecException } from 'child_process';

@Injectable()
export class AuthService {
  constructor(
    //private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.usersService.findOne(username);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
  }

  async login(initDataRow: string) : Promise<any> {
   try{

      //7373997178:AAHbxWQw2gvL2_UHQsDhZprdOv7maYxE_CM
      //process.env.TELEGRAM_BOT_TOKEN
      validate(initDataRow, '7373997178:AAHbxWQw2gvL2_UHQsDhZprdOv7maYxE_CM', {expiresIn: 36000000000})//await this.validateInitData(initDataRow, process.env.TELEGRAM_BOT_TOKEN);
      const data = await this.parseQueryString(initDataRow);
      return data;
    } catch (e) {
      console.log(e.message);
      return {message: e.message}
    }
    // const payload = { username: user.username, sub: user.userId, roles: user.roles };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
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
