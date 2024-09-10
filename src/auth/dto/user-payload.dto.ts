import { $Enums } from "@prisma/client";

export class UserPayloadDto {
    salonId: string;
    userId: string;
    clientStaffId?: string;
    clientId?: string;
    staffId?: string;
    dkdCompanyId: string;
    roles: $Enums.UserRoles[];
}