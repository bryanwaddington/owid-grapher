import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
import { Deploy } from "../clientUtils/owidTypes";
export declare class DeployStatusPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    deploys: Deploy[];
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
//# sourceMappingURL=DeployStatusPage.d.ts.map