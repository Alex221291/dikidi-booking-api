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
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { User } from 'src/auth/user.decorator';
import { ClientService } from 'src/client/client.service';
import { StaffService } from 'src/staff/staff.service';
import { TelegramChatService } from 'src/telegram/telegram-chat.service';
import { SalonService } from 'src/salon/salon.service';
import * as dayjs from 'dayjs';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ru';
import { RecordService } from 'src/record/record.service';

dayjs.extend(localizedFormat);

// Устанавливаем русскую локаль глобально
//dayjs.locale('ru');

@Controller('booking')
export class BookingController {
    private readonly _companyId;
    constructor(
        private readonly bookingService: BookingService,
        private readonly salonService: SalonService,
        private readonly clientService: ClientService,
        private readonly staffService: StaffService,
        private readonly telegramChatService: TelegramChatService,
        private readonly recordService: RecordService,
      ) {}

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
      


    //@Roles('admin')
    //@UseGuards(JwtAuthGuard, RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get('company')
    async getCompany(@User() user: UserPayloadDto): Promise<GetCompanyDto | null> {
        return await this.bookingService.getCompany(user.dkdCompanyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('masters')
    async getMasters(@User() user: UserPayloadDto): Promise<GetMasterDto[] | []> {
        return await this.bookingService.getMasters(user.dkdCompanyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('masters/master/full-info')
    async getMaster(@User() user: UserPayloadDto, @Query('masterId') masterId: string): Promise<any> {
        return this.bookingService.getMasterFullInfo(user.dkdCompanyId, masterId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-masters-multi')
    async getMastersMulti(@User() user: UserPayloadDto, @Query('serviceId') serviceId: string[]): Promise<any> {
        const result =  await this.bookingService.getMastersMulti(user.dkdCompanyId, serviceId);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('services')
    async getServices(@User() user: UserPayloadDto): Promise<GetCategoryWithServiceDto> {
        return this.bookingService.getServices(user.dkdCompanyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('datetimes')
    async getMasterServiceDatetimes(@User() user: UserPayloadDto, @Query('serviceId') serviceId: string, @Query('date') date?: string, @Query('masterId') masterId?: string): Promise<any> {
        const result =  await this.bookingService.getMasterServiceDatetimes(user.dkdCompanyId, serviceId, date || '', masterId);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-datetimes-multi')
    @HttpCode(200)
    async getMasterServiceDatetimesMulti(@User() user: UserPayloadDto, @Body() body: RequestGetDateTimesDto): Promise<GetMasterServiceDatetimesMulti> {
        console.log(body.masters);
        const result =  await this.bookingService.getMasterServiceDatetimesMulti(user.dkdCompanyId, body.masters, body.date);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-dates-true')
    @HttpCode(200)
    async getDatesTrue(@User() user: UserPayloadDto, @Body() body: RequestGetDatesTrueDto): Promise<string[]> {
        console.log(body.masters);
        const result =  await this.bookingService.getDatesTrue(user.dkdCompanyId, body);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('new-record')
    async newRecord(@User() user: UserPayloadDto, @Body() body: RequestRecordDto): Promise<any> {
        const result =  await this.bookingService.newRecord(user.dkdCompanyId, body);
        console.log(result?.error)
        if (result?.error) {
            throw new HttpException(result, HttpStatus.BAD_REQUEST);
        }
        let clientStaffId = user.clientStaffId;
        //добавить клиента если первый заказ
        if(!user.clientStaffId)
        {
            const newClient = await this.clientService.create(
                {
                    name: body.firstName,
                    phone: body.phone,
                    userId: user.userId
            });
            clientStaffId = newClient.id;
        }

        // получить инфу о салоне
        const salon = await this.salonService.getOne(user.salonId);
        try{
            if(salon)
            {
                // получить chatId клиента - отправить сообщение
                const clientUser = await this.clientService.getClientUser(user.userId, clientStaffId);
                const clientDataText = `клиент - ${body.firstName}(${body.phone})
Комментарий: ${body?.comment}`;

                for(const item of result){
                    console.log(result);
                    const masterUser = await this.staffService.getMasterUser(item.master.id);
                    // TODO: добавить инфу о записи в бд
                    const newRecord = await this.recordService.create({
                        clientId: clientStaffId,
                        dkdRecordId: item.id,
                        staffId: masterUser.userId,
                    }); 

                    const recordMainText = `${await this.dateFormat(item?.time, item?.timeTo)}

${item?.services?.map(record => record.name).join('\n')}
                    
${item?.price} ${item?.currency?.abbr}`;
                    const clientText = `Вы записались!
Онлайн-запись является равнозначной записи по телефону и не требует подтверждения

мастер - ${item.master.name}
${recordMainText}`;

                    await this.telegramChatService.sendMessage(salon.tgToken, clientUser.tgChatId.toString(), clientText);
                    // мастеру отослать
                    // получить chatId мастера - отправить сообщение
                    const masterText = `Новая запись!
            
${recordMainText}

${clientDataText}`;
                    await this.telegramChatService.sendMessage(salon.tgToken, masterUser.tgChatId.toString(), masterText);
                    
                
                    // администраторам отослать
                    const administratorsUser = await this.staffService.getSalonAdministratorsUser(salon.id);
                    const administratorText = `Новая запись!

мастер - ${item.master.name}

${recordMainText}
                    
${clientDataText}`;
                    for(const administrator of administratorsUser){
                        await this.telegramChatService.sendMessage(salon.tgToken, administrator.tgChatId.toString(), administratorText);
                    }
                }
            }
        }
        catch(e){
            console.log(e);
            return result;
        }
        return result;
    }

    // @Get('new-record/time-reservation')
    // async timeReservation(@Query('masterId') masterId: string, @Query('serviceId') serviceId: string[], @Query('time') time: string): Promise<any> {
    //     const result =  await this.bookingService.timeReservation(user.dkdCompanyId, masterId, serviceId, time);
    //     return result;
    // }

    @UseGuards(JwtAuthGuard)
    @Post('new-record/check')
    async check(@User() user: UserPayloadDto, @Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.check(user.dkdCompanyId, phone, firstName, comment);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('new-record/record')
    async record(@User() user: UserPayloadDto, @Query('phone') phone: string, @Query('firstName') firstName: string, @Query('comment') comment?: string): Promise<any> {
        const result =  await this.bookingService.record(user.dkdCompanyId, phone, firstName, comment);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('new-record/records-info')
    async recordsInfo(@User() user: UserPayloadDto, @Query('recordId') recordId: string[]): Promise<any> {
        const result =  await this.bookingService.recordInfo(user.dkdCompanyId, recordId);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('remove')
    async removeRecord(@User() user: UserPayloadDto, @Query('recordId') recordId: string): Promise<any> {
        const result =  await this.bookingService.removeRecord(recordId);
        return result;
    }

    async dateFormat(time: string, timeTo): Promise<string> {
        const start = dayjs(time).locale('ru');
        const end = dayjs(timeTo).locale('ru');

        const formattedDate = `${start.format('dddd DD MMMM HH:mm')}-${end.format('HH:mm')}`;
        return formattedDate;
    }
}
