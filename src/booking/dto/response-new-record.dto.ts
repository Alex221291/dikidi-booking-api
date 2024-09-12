import { GetMasterFullInfoDto } from "./get-master-full-info.dto";

export interface ResponseNewRecordDto {
    recordId?: string;
    ycRecordId?: string;
    ycRecordHash?: string;
    clientName?: string;
    clientPhone?: string;
    clientComment?: string;
    datetime?: string;
    master?: GetMasterFullInfoDto;
    message?: string;
}

