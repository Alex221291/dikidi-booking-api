import { GetMasterFullInfoDto } from "./get-master-full-info.dto";

export interface RequestRecordDto {
    firstName: string;
    phone: string;
    comment?: string;
    time: string;
    recordInfo: GetMasterFullInfoDto;
    masters: RequestMasterServicesRecordDto[];
}

export interface RequestMasterServicesRecordDto {
    masterId: string;
    serviceId: string[];
}

export interface RequestRecordInfo {
    time?: string;
    price?: number;
    duration?: number;
    currency?: string;
    master?: MasterRecordInfo;
    services?: ServiceRecordInfo[];
}

export interface MasterRecordInfo {
    id?: string;
    name?: string;
    image?: string;
}

export interface ServiceRecordInfo {
    id?: string;
    name?: string;
    image?: string;
}

