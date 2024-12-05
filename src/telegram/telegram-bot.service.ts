import { ConfigService } from '@nestjs/config';
import { $Enums } from '@prisma/client';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes, Telegraf } from 'telegraf';
// import { TelegramChatService } from './telegram-chat.service';

export interface Context extends Scenes.SceneContext {}

@Update()
export class TelegramBotService extends Telegraf {
    private _token: string;
    constructor(
        private readonly config: ConfigService,
        private prisma: PrismaService,
        // private readonly telegramChatService: TelegramChatService
    ) {
        super(config.get('TELEGRAM_BOT_TOKEN'));
        this._token = config.get('TELEGRAM_BOT_TOKEN');
    }

    @Start()
    async onStart(@Ctx() ctx: Context) {
      const chatId = ctx.message.chat.id;
      const userId = ctx.from.id;
      const userName = ctx.from.username;
      const botId = ctx.botInfo.id;
      const botName = ctx.botInfo.first_name;
      const miniAppButton = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Открыть приложение', web_app: { url: process.env.TELEGRAM_APP_URL } }]
          ]
        }
      };
      const salon = await this.prisma.salon.findFirst({
        where: {tgBotId: botId},
      });
      if(!salon){
        await ctx.reply('Салон не зарегистрирован!');
        return;
      }
      // ищем юзера
      const user = await this.prisma.user.findFirst({
        where: {salonId: salon.id, tgUserId: userId, tgChatId: chatId},
      });

      if(user) {
        await ctx.reply('Привет. Ты уже с нами.\nЗапишись на услугу!', miniAppButton);
        return;
      }
      // проверяем, если нет то создаём
      const newUser = await this.prisma.user.create({
        data:{
          salonId: salon.id,
          tgChatId: chatId,
          tgUserId: userId,
          tgUserName: userName,
          role: $Enums.UserRoles.CLIENT
        }
      });

      console.log(newUser);
    
      await ctx.reply('Привет. Запишись на услугу!', miniAppButton);
    }

    @Command('stop')
    async onStop(@Ctx() ctx: Context) {
      //const chatId = ctx.message.chat.id;
      //await ctx.reply('Пока - ' + chatId);
      // if(result?.affected){
      //   await ctx.reply('Рассылка заявок отключена');
      // } else{
      //   await ctx.reply('Вы уже отписались от рассылки заявок');
      // }
    }
}