import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { DikidiModule } from './dikidi/dikidi.module';
import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BookingModule, DikidiModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
