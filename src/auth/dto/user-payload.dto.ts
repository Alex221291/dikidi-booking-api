import { $Enums } from "@prisma/client";

export class UserPayloadDto {
    salonId: string;
    userId: string;
    clientId?: string;
    staffId?: string;
    extCompanyId: string;
    roles: $Enums.UserRoles[];
    currency?: string;
}