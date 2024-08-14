// import { Injectable } from '@nestjs/common';

//import { Telegraf } from 'telegraf';
//const app = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// @Injectable()
// export class TelegramChatService {
//     constructor(
//     ) {}

    // async create(chatId: number): Promise<TelegramChat | null> {
    //     const isChatExisting = await this.telegramChatRepository.exist({
    //       where: { chatId: chatId },
    //     })
    //     if (isChatExisting) {
    //         return null;
    //     }
    //     return await this.telegramChatRepository.save({chatId});
    // }
    
    // async findAll(): Promise<TelegramChat[]> {
    //     return await this.telegramChatRepository.find()
    // }
    
    // async findOneByChatId(chatId: number): Promise<TelegramChat | null> {
    //     const telegramChat = await this.telegramChatRepository.findOneBy({ chatId })
    //     return telegramChat;
    // }
    
    // async remove(chatId: number): Promise<DeleteResult | null> {
    //     const isChatExisting = await this.telegramChatRepository.exist({ where: { chatId } })
    //     if (!isChatExisting) {
    //         return null;
    //     }
    //     const result = await this.telegramChatRepository.delete({chatId})
    //     return result;
    // }

    // async sendMessage(text: string) {
    //     const result = await this.findAll();
    //     for(const chat of result){
    //         try{
    //             await app.telegram.sendMessage(chat.chatId, text);          
    //         }
    //         catch(e){
    //             await this.remove(chat.chatId);
    //         }
    //     }
    // }
// }