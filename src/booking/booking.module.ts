import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { DikidiModule } from 'src/dikidi/dikidi.module';

@Module({
  imports: [DikidiModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
