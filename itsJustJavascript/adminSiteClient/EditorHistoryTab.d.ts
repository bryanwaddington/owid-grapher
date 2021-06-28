import * as React from "react";
import { ChartEditor, Log } from "./ChartEditor";
export declare class EditorHistoryTab extends React.Component<{
    editor: ChartEditor;
}> {
    get logs(): Log[];
    applyConfig(config: any): Promise<void>;
    render(): JSX.Element;
}
//# sourceMappingURL=EditorHistoryTab.d.ts.map