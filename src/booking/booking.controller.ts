import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, ParseArrayPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { GetMasterDto } from './dto/get-master.dto';
import { GetCategoryWithServiceDto } from './dto/get-service.dto';
import { RequestGetDateTimesDto, RequestMasterServicesDateTimesDto } from './dto/request-get-date-times-multi.dto';
import { GetMasterServiceDatetimesMulti } from './dto/get-master-service-datetimes-multi.dto';
import { RequestGetDatesTrueDto } from './dto/request-get-dates-true.dto';
import { RequestRecordDto } from './dto/request-post-record.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('booking')
export class BookingController {
    private readonly _companyId;
    constructor(
        private readonly bookingService: BookingService
      ) {
        this._companyId = process.env.COMPANY_ID;
      }

      //@Roles('admin')
      //@UseGuards(JwtAuthGuard, RolesGuard)
      @Get('cookie')
      async getCookie(): Promise<any> {
          let headers = {};
          // Отправляем запрос к dikidi.ru с фронтенда
          await fetch('https://dikidi.ru/ru/mobile/ajax/newrecord/project_options/?social_key=&company=591511', {
              method: 'GET',
              credentials: 'include' // Включает куки в запрос
          })
          .then(response => {
              for (let pair of response.headers.entries()) {
                  headers[pair[0]] = pair[1];
              }
              return response.json();
          })
          .then(data => {
              // Обработка данных
          })
          .catch(error => {
              console.error('Error:', error);
          });
      
          return headers['set-cookie'];
      }
      


    @Roles('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('company')
    async getCompany(): Promise<GetCompanyDto | null> {
        return await this.bookingService.getCompany(this._companyId);
    }

    @Get('masters')
    async getMasters(): Promise<GetMasterDto[] | []> {
        return await this.bookingService.getMasters(this._companyId);
    }

    @Get('masters/master/full-info')
    async getMaster(@Query('masterId') masterId: string): Promise<any> {
        return this.bookingService.getMasterFullInfo(this._companyId, masterId);
    }

    @Get('get-masters-multi')
    async getMastersMulti(@Query('serviceId') serviceId: string[]): Promise<any> {
        const result =  await this.bookingService.getMastersMulti(this._companyId, serviceId);
        return result;
    }

    @Get('services')
    async getServices(): Promise<GetCategoryWithServiceDto> {
        return this.bookingService.getServices(this._companyId);
    }

    @Get('datetimes')
    async getMasterServiceDatetimes(@Query('serviceId') serviceId: string, @Query('date') date?: string, @Query('masterId') masterId?: string): Promise<any> {
        const result =  await this.bookingService.getMasterServiceDatetimes(this._companyId, serviceId, date || '', masterId);
        return result;
    }

    // @Get('datetimes-multi')
    // async getMasterServiceDatetimesMulti(@Query('masters', new ParseArrayPipe({ items: RequestMasterServicesDateTimesDto, separator: ',' })) masters: RequestMasterServicesDateTimesDto[], @Query('date') date?: string): Promise<any> {
    //     console.log(masters);
    //     const result =  await this.bookingService.getMasterServiceDatetimesMulti(this._companyId, masters, date);
    //     return result;
    // }

    @Post('get-datetimes-multi')
    @HttpCode(200)
    async getMasterServiceDatetimesMulti(@Body() body: RequestGetDateTimesDto): Promise<GetMasterServiceDatetimesMulti> {
        console.log(body.masters);
        const result =  await this.bookingService.getMasterServiceDatetimesMulti(this._companyId, body.masters, body.date);
        return result;
    }

    @Post('get-dates-true')
    @HttpCode(200)
    async getDatesTrue(@Body() body: RequestGetDatesTrueDto): Promise<string[]> {
        console.log(body.masters);
        const result =  await this.bookingService.getDatesTrue(this._companyId, body);
        return result;
    }

    @Post('new-record')
    async newRecord(@Body() body: RequestRecordDto): Promise<any> {
        const result =  await this.bookingService.newRecord(this._companyId, body);
        console.log(result?.error)
        if (result?.error) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }
        return result;
    }

    // @Get('new-record/time-reservation')
    // async timeReservation(@Query('masterId') masterId: string, @Query('serviceId') serviceId: string[], @Query('time') time: string): Promise<any> {
    //     const result =  await this.bookingService.timeReservation(this._companyId, masterId, serviceId, time);
    //     return result;
    // }

    @Post('new-record/check')
    async check(@Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.check(this._companyId, phone, firstName, comment);
        return result;
    }

    @Post('new-record/record')
    async record(@Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.record(this._companyId, phone, firstName, comment);
        return result;
    }

    @Get('new-record/records-info')
    async recordsInfo(@Query('recordId') recordId: string[]): Promise<any> {
        const result =  await this.bookingService.recordInfo(this._companyId, recordId);
        return result;
    }
}
