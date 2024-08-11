export interface GetServiceDto {
    id?: string;
    name?: string;
    image?: string;
    time?: number;
    price?: number;
}

export interface GetCategoryWithServiceDto {
    id?: string;
    name?: string;
    services?: GetServiceDto[];
}