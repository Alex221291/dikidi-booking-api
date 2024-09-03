import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SalonService } from './salon.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { RequestCreateSalonDto } from './dto/request-cretate-salon.dto';
import { User } from 'src/auth/user.decorator';

@Controller('salon')
export class SalonController {
    constructor(
        private readonly salonService: SalonService,
      ) {}
      


    //@Roles('admin')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@User() user: UserPayloadDto, @Body() data: RequestCreateSalonDto): Promise<any> {
        return await this.salonService.create(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@User() user: UserPayloadDto): Promise<any> {
        return await this.salonService.getAll();
    }
}
