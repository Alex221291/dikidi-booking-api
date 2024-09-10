
export interface ResponseNewRecordDto {
    id?: string;
    time?: string;
    timeTo?: string;
    price?: string;
    duration?: string;
    durationString?: string;
    client?: ClientRecordInfo;
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
    price?: string;
    duration?: string;
    durationString?: string;
    image?: string;
}

export interface ClientRecordInfo {
    name?: string;
    phone?: string;
    comment?: string;
}

