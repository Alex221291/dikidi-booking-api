import { Controller, Get, UseGuards } from '@nestjs/common';
import { RecordService } from './record.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { User } from 'src/auth/user.decorator';

@Controller('record')
export class RecordController {
    constructor(
        private readonly recordService: RecordService,
      ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@User() user: UserPayloadDto): Promise<any> {
        return await this.recordService.getClientRecords(user.clientStaffId);
    }
}
