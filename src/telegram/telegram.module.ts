import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegrafModule } from 'nestjs-telegraf'
import { options } from './telegram-config.factory'
//import { TelegramChatService } from './telegram-chat.service'

@Module({
  imports: [TelegrafModule.forRootAsync(options())],
  providers: [TelegramService], //, TelegramChatService
  //exports: [TelegramChatService],
})
export class TelegramModule {}
