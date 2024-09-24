import { $Enums } from "@prisma/client";

export class RequestCreateStaffDto {
    appUserId: string;
    extMasterId?: string;
    role: $Enums.UserRoles;
}