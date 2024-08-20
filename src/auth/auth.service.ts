import { Injectable } from '@nestjs/common';
const crypto = require('crypto');
const { URLSearchParams } = require('url');

@Injectable()
export class AuthService {
    async validateInitData(initData: object, botToken: string): Promise<boolean> {
        const urlSearchParams = new URLSearchParams(initData);
        const data = Object.fromEntries(urlSearchParams.entries());
        
        const checkString = Object.keys(data)
          .filter(key => key !== 'hash')
          .map(key => `${key}=${data[key]}`)
          .sort()
          .join('\n');
          
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
          .update(botToken)
          .digest();
          
        const signature = crypto.createHmac('sha256', secretKey)
          .update(checkString)
          .digest('hex');
          
        return data.hash === signature;
      }
}
