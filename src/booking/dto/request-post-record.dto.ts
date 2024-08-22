export class RequestRecordDto {
    firstName: string;
    phone: string;
    comment?: string;
    time: string;
    masters: RequestMasterServicesRecordDto[];
}

export class RequestMasterServicesRecordDto {
    masterId: string;
    serviceId: string[];
}

