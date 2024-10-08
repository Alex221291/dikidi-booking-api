import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
      ) {}

    //@UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query('salonId') salonId: string): Promise<any> {
        return await this.userService.getAll(salonId);
    }
}
