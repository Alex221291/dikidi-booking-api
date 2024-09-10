export class RequestMasterServicesDateTimesDto {
    masterId: string;
    serviceId?: string[];
}

export class RequestGetDateTimesDto {
    date?: string;
    masters: RequestMasterServicesDateTimesDto[];
}

