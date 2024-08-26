export interface GetMasterServiceDatetimes {
    serviceId?: string;
    masters?: MasterDatetimesInfo[];
    workData?: WorkData;
}

export interface MasterDatetimesInfo {
    masterId?: string;
    masterName?: string;
    masterImage?: string;
    serviceName?: string;
    serviceImage?: string;
    price?: string;
    time?: string;
    currency?: string;
    times?: string[];
}

export interface WorkData {
    dateTrue?: string[];
    dateNear?: string;
}

