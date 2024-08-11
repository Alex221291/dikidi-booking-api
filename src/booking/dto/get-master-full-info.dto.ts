import { GetServiceDto } from "./get-service.dto";

export interface GetMasterFullInfoDto {
    id?: string;
    name?: string;
    post?: string;
    description?: string;
    image?: string;
    gallery?: Gallery[];
    services?: GetServiceDto[];
    currency?: Currency;
}

export interface Currency {
    id?: number;
    title?: string;
    abbr?: string;
    iso?: string;
}

export interface Gallery{
    big?: string,
    zoom?: string,
}
