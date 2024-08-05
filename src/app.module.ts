import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { DikidiModule } from './dikidi/dikidi.module';

@Module({
  imports: [BookingModule, DikidiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
