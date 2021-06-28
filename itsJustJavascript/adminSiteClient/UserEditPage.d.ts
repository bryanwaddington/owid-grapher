import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
import { UserIndexMeta } from "./UserMeta";
export declare class UserEditPage extends React.Component<{
    userId: number;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    user?: UserIndexMeta;
    isSaved: boolean;
    render(): JSX.Element | null;
    save(): Promise<void>;
    getData(): Promise<void>;
    componentDidMount(): void;
}
//# sourceMappingURL=UserEditPage.d.ts.map