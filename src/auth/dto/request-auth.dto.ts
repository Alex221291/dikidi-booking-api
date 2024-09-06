export class RequestAuthDto {
    initDataRaw: any;
    user: UserInitData;
}

export class UserInitData {
    allowsWriteToPm?: boolean;
    firstName?: string;
    lastName?: string;
    id?: number;
    languageCode?: string;
    username?: string;
}