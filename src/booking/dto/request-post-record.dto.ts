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
