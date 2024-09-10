import { Module } from '@nestjs/common';
import { YclientsService } from './yclients.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [YclientsService],
  exports: [YclientsService],
})
export class YclientsModule {}
