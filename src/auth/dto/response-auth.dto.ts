import { $Enums } from "@prisma/client";

export class ResponseAuthDto {
    role: $Enums.UserRoles;
    message: string;
}