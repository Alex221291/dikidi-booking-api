export interface GetServiceDto {
    id?: string;
    name?: string;
    image?: string;
    time?: number;
    priceMin?: number;
    priceMax?: number;
}

export interface GetCategoryWithServiceDto {
    id?: string;
    name?: string;
    services?: GetServiceDto[];
}