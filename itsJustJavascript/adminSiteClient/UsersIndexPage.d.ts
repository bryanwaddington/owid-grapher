import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
import { UserIndexMeta } from "./UserMeta";
interface UserIndexMetaWithLastSeen extends UserIndexMeta {
    lastSeen: Date;
}
export declare class UsersIndexPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    users: UserIndexMetaWithLastSeen[];
    isInviteModal: boolean;
    onDelete(user: UserIndexMetaWithLastSeen): Promise<void>;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
export {};
//# sourceMappingURL=UsersIndexPage.d.ts.map