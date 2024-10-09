import { Module } from '@nestjs/common';
import { DataSyncService } from './data_sync.service';

@Module({
  providers: [DataSyncService]
})
export class DataSyncModule {}
