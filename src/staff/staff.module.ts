import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [PrismaModule, TelegramModule],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
