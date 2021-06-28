import * as React from "react";
import { ChartEditor, ChartRedirect } from "./ChartEditor";
export declare class EditorReferencesTab extends React.Component<{
    editor: ChartEditor;
}> {
    get isPersisted(): number | undefined;
    get references(): import("./ChartEditor").PostReference[];
    get redirects(): ChartRedirect[];
    appendRedirect(redirect: ChartRedirect): void;
    render(): JSX.Element;
}
//# sourceMappingURL=EditorReferencesTab.d.ts.map