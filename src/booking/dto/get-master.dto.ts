export interface GetMasterDto {
    id?: string;
    name?: string;
    post?: string;
    image?: string;
    rating?: string;
    seanceDate?: string;
    futureRecordingInfo?: FutureRecordingInfo;
}

export interface FutureRecordingInfo {
    totalDuration?: number;
    totalPrice?: number;
}

