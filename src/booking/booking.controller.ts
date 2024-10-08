import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, ParseArrayPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { GetMasterFullInfoDto } from './dto/get-master-full-info.dto';
import { ResponseNewRecordDto } from './dto/response-new-record.dto';
import { MessageChannel } from 'worker_threads';
import { ResponseGetRecordFullInfoDto } from 'src/record/dto/response-get-record-full-info.dto';
import { RequestUpdateRecordDto } from 'src/record/dto/request-update-record.dto';

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
    async getMasters(@User() user: UserPayloadDto): Promise<GetMasterDto[]> {
        return await this.bookingService.getMasters(user.dkdCompanyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('masters/master/full-info')
    async getMaster(@User() user: UserPayloadDto, @Query('masterId') masterId: string): Promise<GetMasterFullInfoDto> {
        return this.bookingService.getMasterFullInfo(user.dkdCompanyId, masterId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-masters-multi')
    async getMastersMulti(@User() user: UserPayloadDto, @Query('serviceId') serviceId: string[]): Promise<GetMasterFullInfoDto[]> {
        const result =  await this.bookingService.getMastersMulti(user.dkdCompanyId, serviceId);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('services')
    async getServices(@User() user: UserPayloadDto): Promise<GetCategoryWithServiceDto> {
        return this.bookingService.getServices(user.dkdCompanyId);
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('datetimes')
    // async getMasterServiceDatetimes(@User() user: UserPayloadDto, @Query('serviceId') serviceId: string, @Query('date') date?: string, @Query('masterId') masterId?: string): Promise<any> {
    //     const result =  await this.bookingService.getMasterServiceDatetimes(user.dkdCompanyId, serviceId, date || '', masterId);
    //     return result;
    // }

    @UseGuards(JwtAuthGuard)
    @Post('get-datetimes-multi')
    @HttpCode(200)
    async getMasterServiceDatetimesMulti(@User() user: UserPayloadDto, @Body() body: RequestGetDateTimesDto): Promise<GetMasterServiceDatetimesMulti> {
        const result =  await this.bookingService.getMasterServiceDatetimesMulti(user.dkdCompanyId, body);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-dates-true')
    @HttpCode(200)
    async getDatesTrue(@User() user: UserPayloadDto, @Body() body: RequestGetDatesTrueDto): Promise<string[]> {
        const result =  await this.bookingService.getDatesTrue(user.dkdCompanyId, body);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('new-record')
    async newRecord(@User() user: UserPayloadDto, @Body() body: RequestRecordDto): Promise<ResponseGetRecordFullInfoDto> {
        const result =  await this.bookingService.newRecord(user.dkdCompanyId, body);
        //return {status: result?.status, data: result?.data};
        if (result?.status != 201) {
            throw new HttpException({message: result.data?.meta?.message}, HttpStatus.BAD_REQUEST);
        }
        let clientId = user.clientId;
        //добавить клиента если первый заказ
        if(!user.clientId)
        {
            const newClient = await this.clientService.create(
                {
                    name: body.firstName,
                    phone: body.phone,
                    userId: user.userId
            });
            clientId = newClient.id;
        }

        const salon = await this.salonService.getOne(user.salonId);
        try{
                // получить chatId клиента - отправить сообщение
                const clientUser = await this.clientService.getClientUser(user.userId, clientId);
                const totalPriceText = 
                body.recordInfo.totalTimePriceInfo?.totalPriceMin === body.recordInfo?.totalTimePriceInfo?.totalPriceMax 
                ? `${body.recordInfo?.totalTimePriceInfo?.totalPriceMax}` : `${body.recordInfo?.totalTimePriceInfo?.totalPriceMin} - ${body.recordInfo?.totalTimePriceInfo?.totalPriceMax}`;
                const clientDataText = `клиент - ${body.firstName}(${body.phone})
Комментарий: ${body?.comment}`;

                const masterUser = await this.staffService.getMasterUser(body.recordInfo.id);
                // добавить инфу о записи в бд
                const newRecord = await this.recordService.create({
                    clientId: clientId,
                    dkdRecordId: result?.data?.data[0]?.record_id.toString(),
                    ycRecordHash: result?.data?.data[0]?.record_hash,
                    staffId: masterUser?.userId,
                    dkdDate: new Date(body?.time).toISOString(),
                    clientName: body?.firstName,
                    clientPhone: body?.phone,
                    clientComment: body?.comment,
                    recordInfo: JSON.stringify(body.recordInfo),
                }); 

                const recordMainText = `${await this.dateFormat(body.time, body.recordInfo?.totalTimePriceInfo?.totalDuration)}

${body.recordInfo.services?.map(service => service.name).join('\n')}
                    
${totalPriceText} ${user?.currency}`;
                    const clientText = `Вы записались!
Онлайн-запись является равнозначной записи по телефону и не требует подтверждения

мастер - ${body.recordInfo?.name}
${recordMainText}`;

                await this.telegramChatService.sendMessage(salon.tgToken, clientUser.tgChatId.toString(), clientText);
                // мастеру отослать
                // получить chatId мастера - отправить сообщение
                const masterText = `Новая запись!
            
${recordMainText}

${clientDataText}`;
                await this.telegramChatService.sendMessage(salon.tgToken, masterUser?.tgChatId.toString(), masterText);
                    
                
                // администраторам отослать
                const administratorsUser = await this.staffService.getSalonAdministratorsUser(salon.id);
                const administratorText = `Новая запись!

мастер - ${body.recordInfo?.name}

${recordMainText}
                    
${clientDataText}`;
                for(const administrator of administratorsUser){
                    await this.telegramChatService.sendMessage(salon.tgToken, administrator?.tgChatId.toString(), administratorText);
                }
                //let recordInfo = await this.recordService.getById(user.dkdCompanyId, newRecord.id);
                return {
                    id: newRecord.id,
                    ycRecordId: result?.data?.data[0]?.record_id.toString(),
                    clientName: body?.firstName,
                    clientPhone: body?.phone,
                    clientComment: body?.comment,
                    datetime: body?.time,
                    master: body?.recordInfo,
                    ycRecordHash: result?.data?.data[0]?.record_hash,
                    message: 'Запись создана'
                };
        }
        catch(e){
            console.log(e);
            return {message: result.message};
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove-record')
    @HttpCode(200)
    async removeRecord(@User() user: UserPayloadDto, @Query('id') recordId: string): Promise<any> {
        const result =  await this.bookingService.removeRecord(user.dkdCompanyId, recordId);
        if(result?.error) throw new HttpException(result, HttpStatus.BAD_REQUEST);
        //раскидать в телегу

        const salon = await this.salonService.getOne(user.salonId);
        try{
                // получить chatId клиента - отправить сообщение
                const clientUser = await this.clientService.getClientUser(user.userId, user.clientId);
                const totalPriceText = 
                result?.master?.totalTimePriceInfo?.totalPriceMin === result?.master?.totalTimePriceInfo?.totalPriceMax 
                ? `${result?.master?.totalTimePriceInfo?.totalPriceMax}` : `${result?.master?.totalTimePriceInfo?.totalPriceMin} - ${result?.master?.totalTimePriceInfo?.totalPriceMax}`;
                const clientDataText = `клиент - ${result.clientName}(${result.clientPhone})
Комментарий: ${result?.clientComment}`;

                const masterUser = await this.staffService.getMasterUser(result?.master?.id);

                const recordMainText = `${await this.dateFormat(result.datetime, result?.master?.totalTimePriceInfo?.totalDuration)}

${result?.master?.services?.map(service => service.name).join('\n')}
                    
${totalPriceText} ${user?.currency}`;
                    const clientText = `Уважаемый клиент! Ваша запись отменена

мастер - ${result?.master?.name}
${recordMainText}`;

                await this.telegramChatService.sendMessage(salon.tgToken, clientUser.tgChatId.toString(), clientText);
                // мастеру отослать
                // получить chatId мастера - отправить сообщение
                const masterText = `Запись отменена!
            
${recordMainText}

${clientDataText}`;
                await this.telegramChatService.sendMessage(salon.tgToken, masterUser?.tgChatId.toString(), masterText);
                    
                
                // администраторам отослать
                const administratorsUser = await this.staffService.getSalonAdministratorsUser(salon.id);
                const administratorText = `Запись отменена!

мастер - ${result?.master?.name}

${recordMainText}
                    
${clientDataText}`;
                for(const administrator of administratorsUser){
                    await this.telegramChatService.sendMessage(salon.tgToken, administrator?.tgChatId.toString(), administratorText);
                }
                return result;
        }
        catch(e){
            console.log(e);
            return {message: result.message};
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('transfer-record')
    async transferRecord(@User() user: UserPayloadDto, @Body() body: RequestUpdateRecordDto): Promise<any> {
        const result =  await this.bookingService.transferRecord(user.dkdCompanyId, body);
        if(result?.error) throw new HttpException(result, HttpStatus.BAD_REQUEST);

        const salon = await this.salonService.getOne(user.salonId);
        try{
                // получить chatId клиента - отправить сообщение
                const clientUser = await this.clientService.getClientUser(user.userId, user.clientId);
                const totalPriceText = 
                result?.master?.totalTimePriceInfo?.totalPriceMin === result?.master?.totalTimePriceInfo?.totalPriceMax 
                ? `${result?.master?.totalTimePriceInfo?.totalPriceMax}` : `${result?.master?.totalTimePriceInfo?.totalPriceMin} - ${result?.master?.totalTimePriceInfo?.totalPriceMax}`;
                const clientDataText = `клиент - ${result.clientName}(${result.clientPhone})
Комментарий: ${result?.clientComment}`;

                const masterUser = await this.staffService.getMasterUser(result?.master?.id);
                // добавить инфу о записи в бд

                const recordMainText = `${await this.dateFormat(result.datetime, result?.master?.totalTimePriceInfo?.totalDuration)}

${result?.master?.services?.map(service => service.name).join('\n')}
                    
${totalPriceText} ${user?.currency}`;
                    const clientText = `Уважаемый клиент! Ваша запись перенесена

мастер - ${result?.master?.name}
${recordMainText}`;

                await this.telegramChatService.sendMessage(salon.tgToken, clientUser.tgChatId.toString(), clientText);
                // мастеру отослать
                // получить chatId мастера - отправить сообщение
                const masterText = `Запись перенесена!
            
${recordMainText}

${clientDataText}`;
                await this.telegramChatService.sendMessage(salon.tgToken, masterUser?.tgChatId.toString(), masterText);
                    
                
                // администраторам отослать
                const administratorsUser = await this.staffService.getSalonAdministratorsUser(salon.id);
                const administratorText = `Запись перенесена!

мастер - ${result?.master?.name}

${recordMainText}
                    
${clientDataText}`;
                for(const administrator of administratorsUser){
                    await this.telegramChatService.sendMessage(salon.tgToken, administrator?.tgChatId.toString(), administratorText);
                }
                return result;
        }
        catch(e){
            console.log(e);
            return {message: result.message};
        }
    }

    async dateFormat(time: string, duration: number): Promise<string> {
        const start = dayjs(time).locale('ru');
        const end = dayjs(time).add(duration, 'minutes').locale('ru');

        const formattedDate = `${start.format('dddd DD MMMM HH:mm')}-${end.format('HH:mm')}`;
        return formattedDate;
    }
}
