import { GetServiceDto } from "./get-service.dto";

export interface GetMastersMultiDto {
    serviceId?: string;
    masters?: MasterMultiInfo[];
}

export interface MasterMultiInfo {
    masterId?: string;
    masterName?: string;
    masterImage?: string;
    serviceName?: string;
    serviceImage?: string;
    cost?: string;
    time?: string;
    currency?: string;
}

