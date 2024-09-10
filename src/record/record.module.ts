import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DikidiModule } from 'src/dikidi/dikidi.module';

@Module({
  imports: [PrismaModule, DikidiModule],
  providers: [RecordService],
  controllers: [RecordController],
  exports:[RecordService]
})
export class RecordModule {}
