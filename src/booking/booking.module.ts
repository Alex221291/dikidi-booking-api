import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { DikidiModule } from 'src/dikidi/dikidi.module';
import { ClientModule } from 'src/client/client.module';
import { StaffModule } from 'src/staff/staff.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { SalonModule } from 'src/salon/salon.module';
import { RecordModule } from 'src/record/record.module';
import { YclientsModule } from 'src/yclients/yclients.module';

@Module({
  imports: [DikidiModule, SalonModule, ClientModule, StaffModule, TelegramModule, RecordModule, YclientsModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
