export interface GetMasterFullInfoDto {
    id?: string;
    name?: string;
    post?: string;
    description?: string;
    image?: string;
    rating?: string;
    seanceDate?: string;
    gallery?: Gallery[];
    services?: ServiceDateTimes[];
}

export interface Gallery{
    big?: string,
    zoom?: string,
}

export interface ServiceDateTimes {
    id?: string;
    name?: string;
    image?: string;
    time?: number;
    priceMin?: number;
    priceMax?: number;
}

