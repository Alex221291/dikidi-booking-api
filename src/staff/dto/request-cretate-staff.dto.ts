import { $Enums } from "@prisma/client";

export class RequestCreateStaffDto {
    appUserId: string;
    dkdMasterId?: string;
    role: $Enums.UserRoles;
}