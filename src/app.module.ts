import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { DikidiModule } from './dikidi/dikidi.module';
import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SalonModule } from './salon/salon.module';
import { ClientModule } from './client/client.module';
import { StaffModule } from './staff/staff.module';
import { RecordModule } from './record/record.module';
import { UserModule } from './user/user.module';
import { YclientsModule } from './yclients/yclients.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BookingModule, DikidiModule, TelegramModule, AuthModule, PrismaModule, SalonModule, ClientModule, StaffModule, RecordModule, UserModule, YclientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
