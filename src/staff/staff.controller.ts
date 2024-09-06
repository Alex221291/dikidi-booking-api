import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { RequestCreateStaffDto } from './dto/request-cretate-staff.dto';

@Controller('staff')
export class StaffController {
    constructor(
        private readonly staffService: StaffService,
      ) {}
      


    //@Roles('admin')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: RequestCreateStaffDto): Promise<any> {
        return await this.staffService.createStaff(data);
    }

    //@UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query('salonId') salonId: string): Promise<any> {
        return await this.staffService.getStaff(salonId);
    }
}
