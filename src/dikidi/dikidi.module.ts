import { Module } from '@nestjs/common';
import { DikidiService } from './dikidi.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [DikidiService],
  exports: [DikidiService],
})
export class DikidiModule {}
