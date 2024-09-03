import { Injectable } from '@nestjs/common';

import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramChatService {
    constructor(
    ) {}

    async sendMessage(botToken: string, chatId: string, text: string) {
        try{
            const app = new Telegraf(botToken);
            await app.telegram.sendMessage(chatId, text);          
        }
        catch(e){
            console.log(`Чат недоступен - ${chatId}`);
        }
    }
}