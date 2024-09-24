import { GetMasterFullInfoDto } from "src/booking/dto/get-master-full-info.dto";

export class ResponseGetRecordFullInfoDto {
    id?: string;
    extRecordId?: string;
    extRecordHash?: string;
    clientName?: string;
    clientPhone?: string;
    clientComment?: string;
    datetime?: string;
    master?: GetMasterFullInfoDto;
    message?: string;
}