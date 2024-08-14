import { ConfigService } from '@nestjs/config';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
// import { TelegramChatService } from './telegram-chat.service';

export interface Context extends Scenes.SceneContext {}

@Update()
export class TelegramService extends Telegraf {
    private _token: string;
    constructor(
        private readonly config: ConfigService,
        // private readonly telegramChatService: TelegramChatService
    ) {
        super(config.get('TELEGRAM_BOT_TOKEN'));
        this._token = config.get('TELEGRAM_BOT_TOKEN');
    }

    @Start()
    async onStart(@Ctx() ctx: Context) {
      const chatId = ctx.message.chat.id;
      await ctx.reply('Привет - ' + chatId + ' - \n' + JSON.stringify(ctx.botInfo));
      // if(result){
      //   await ctx.reply('Рассылка заявок подключена');
      // } else{
      //   await ctx.reply('Вы уже подписаны на рассылку заявок');
      // }
    }

    @Command('stop')
    async onStop(@Ctx() ctx: Context) {
      const chatId = ctx.message.chat.id;
      await ctx.reply('Пока - ' + chatId + ' - \n' + JSON.stringify(ctx.botInfo));
      // if(result?.affected){
      //   await ctx.reply('Рассылка заявок отключена');
      // } else{
      //   await ctx.reply('Вы уже отписались от рассылки заявок');
      // }
    }
}