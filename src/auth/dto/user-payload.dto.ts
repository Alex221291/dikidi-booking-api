import { $Enums } from "@prisma/client";

export class UserPayloadDto {
    salonId: string;
    userId: string;
    clientStaffId?: string;
    dkdCompanyId: string;
    roles: $Enums.UserRoles[];
}