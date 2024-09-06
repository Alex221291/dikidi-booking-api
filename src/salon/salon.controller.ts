import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SalonService } from './salon.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestCreateSalonDto } from './dto/request-cretate-salon.dto';

@Controller('salon')
export class SalonController {
    constructor(
        private readonly salonService: SalonService,
      ) {}

    //@Roles('admin')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: RequestCreateSalonDto): Promise<any> {
        return await this.salonService.create(data);
    }

    //@UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<any> {
        return await this.salonService.getAll();
    }
}
