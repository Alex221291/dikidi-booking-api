import { RequestMasterServicesDateTimesDto } from "./request-get-date-times-multi.dto";

export class RequestGetDatesTrueDto {
    dateFrom: string;
    dateTo: string;
    masters: RequestMasterServicesDateTimesDto[];
}
