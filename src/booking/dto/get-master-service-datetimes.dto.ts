export interface GetMasterServiceDatetimes {
    id?: string;
    name?: string;
    image?: string;
    serviceName?: string;
    serviceImage?: string;
    time?: string;
    price?: string;
    workData?: WorkData;
}

export interface WorkData {
    dateTrue?: string[];
    dateNear?: string;
    times?: string[];
}

