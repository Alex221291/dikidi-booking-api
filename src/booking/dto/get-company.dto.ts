export interface GetCompanyDto {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    schedule?: string;
    phones?: string[];
    city?: string;
    address?: string;
    coordinateLat?: number;
    coordinateLon?: number;
    currencyShortTitle?: string;
}