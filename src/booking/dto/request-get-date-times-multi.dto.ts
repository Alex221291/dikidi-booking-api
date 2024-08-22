import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class RequestMasterServicesDateTimesDto {
    @IsString()
    masterId: string;

    @IsArray()
    @IsString({ each: true })
    serviceId: string[];
}

export class RequestGetDateTimesDto {
    @IsString()
    date?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestMasterServicesDateTimesDto)
    masters: RequestMasterServicesDateTimesDto[];
}




// export class RequestGetDateTimesDto {
//     date?: string;
//     masters: RequestMasterServicesDateTimesDto[];
// }

// export class RequestMasterServicesDateTimesDto {
//     masterId: string;
//     serviceId: string[];
// }

