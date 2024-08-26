import { Currency } from "./get-master-full-info.dto";

export interface ResponseNewRecordDto {
    id?: string;
    time?: string;
    timeTo?: string;
    price?: string;
    duration?: string;
    durationString?: string;
    currency?: Currency;
    master?: MasterRecordInfo;
    services?: ServiceRecordInfo;
}

export interface MasterRecordInfo {
    id?: string;
    name?: string;
    image?: string;
}

export interface ServiceRecordInfo {
    id?: string;
    name?: string;
    price?: string;
    duration?: string;
    durationString?: string;
    image?: string;
}

