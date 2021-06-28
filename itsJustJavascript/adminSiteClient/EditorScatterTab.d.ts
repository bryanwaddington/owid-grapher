import * as React from "react";
import { Grapher } from "../grapher/core/Grapher";
import { ComparisonLineConfig } from "../grapher/scatterCharts/ComparisonLine";
import { HighlightToggleConfig } from "../grapher/core/GrapherConstants";
export declare class EditorScatterTab extends React.Component<{
    grapher: Grapher;
}> {
    comparisonLine: ComparisonLineConfig;
    highlightToggle: HighlightToggleConfig;
    get hasHighlightToggle(): boolean;
    constructor(props: {
        grapher: Grapher;
    });
    onToggleHideTimeline(value: boolean): void;
    onToggleHideLinesOutsideTolerance(value: boolean): void;
    onXOverrideYear(value: number | undefined): void;
    onToggleHighlightToggle(value: boolean): void;
    save(): void;
    private get excludedEntityNames();
    private get excludedEntityChoices();
    onExcludeEntity(entity: string): void;
    onUnexcludeEntity(entity: string): void;
    onToggleConnection(value: boolean): void;
    onChangeScatterPointLabelStrategy(value: string): void;
    render(): JSX.Element;
}
//# sourceMappingURL=EditorScatterTab.d.ts.map