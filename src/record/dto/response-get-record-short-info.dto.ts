export class ResponseGetRecordShortInfoDto {
    id?: string;
    extRecordId?: string;
    clientName?: string;
    clientPhone?: string;
    clientComment?: string;
    datetime?: string;
    duration?: number;
    masterName?: string;
    masterImage?: string;
    servicesName: string[];
    currency?: string;
    totalPriceMin?:number;
    totalPriceMax?:number;
}