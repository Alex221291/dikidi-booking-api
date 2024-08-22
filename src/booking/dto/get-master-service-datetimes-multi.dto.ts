export interface GetMasterServiceDatetimesMulti {
    masterInfo?: MasterInfo[];
    workData?: WorkDataInfo;
}

export interface WorkDataInfo {
    dateTrue?: string[];
    dateNear?: string;
    times?: string[][];
}

export interface ServiceInfo {
    serviceId?: string;
    serviceName?: string;
    serviceImage?: string;
    time?: string;
    price?: string;
}

export interface MasterInfo {
    id?: string;
    name?: string;
    image?: string;
    serviceInfo?: ServiceInfo[];
}

