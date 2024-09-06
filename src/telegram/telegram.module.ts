import { Module } from '@nestjs/common'
import { TelegramBotService } from './telegram-bot.service'
import { TelegrafModule } from 'nestjs-telegraf'
import { options } from './telegram-config.factory'
import { PrismaModule } from 'src/prisma/prisma.module'
import { TelegramChatService } from './telegram-chat.service'

@Module({
  imports: [TelegrafModule.forRootAsync(options()), PrismaModule],
  providers: [TelegramBotService, TelegramChatService],
  exports: [TelegramChatService],
})
export class TelegramModule {}
