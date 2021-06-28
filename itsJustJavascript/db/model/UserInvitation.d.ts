import { BaseEntity } from "typeorm";
export declare class UserInvitation extends BaseEntity {
    static makeInviteCode(): string;
    id: number;
    code: string;
    email: string;
    validTill: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=UserInvitation.d.ts.map