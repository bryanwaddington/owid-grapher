import { ChartEditor } from "./ChartEditor";
export declare class EditorFeatures {
    editor: ChartEditor;
    constructor(editor: ChartEditor);
    get grapher(): import("../grapher/core/Grapher").Grapher;
    get canCustomizeYAxisScale(): boolean;
    get canCustomizeXAxisScale(): boolean;
    get canCustomizeYAxisLabel(): boolean;
    get canCustomizeXAxisLabel(): boolean;
    get canCustomizeYAxis(): boolean;
    get canCustomizeXAxis(): boolean;
    get canRemovePointsOutsideAxisDomain(): boolean;
    get timeDomain(): boolean;
    get timelineRange(): boolean;
    get showYearLabels(): boolean;
    get hideLegend(): boolean;
    get stackedArea(): boolean;
    get entityType(): boolean;
    get relativeModeToggle(): boolean;
    get comparisonLine(): boolean;
}
//# sourceMappingURL=EditorFeatures.d.ts.map