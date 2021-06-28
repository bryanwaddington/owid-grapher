import * as React from "react";
import { QueryParams } from "../../clientUtils/urls/UrlUtils";
import { GrapherTabOption, HighlightToggleConfig, RelatedQuestionsConfig, StackMode } from "../core/GrapherConstants";
import { ShareMenuManager } from "./ShareMenu";
import { TimelineController } from "../timeline/TimelineController";
import { SelectionArray } from "../selection/SelectionArray";
import { AxisConfig } from "../axis/AxisConfig";
export interface HighlightToggleManager {
    highlightToggle?: HighlightToggleConfig;
    selectionArray?: SelectionArray;
    populateFromQueryParams: (obj: QueryParams) => void;
}
export declare class HighlightToggle extends React.Component<{
    manager: HighlightToggleManager;
}> {
    private get manager();
    private get highlight();
    private get highlightParams();
    private onHighlightToggle;
    private get isHighlightActive();
    render(): JSX.Element;
}
export interface AbsRelToggleManager {
    stackMode?: StackMode;
    relativeToggleLabel?: string;
}
export declare class AbsRelToggle extends React.Component<{
    manager: AbsRelToggleManager;
}> {
    onToggle(): void;
    get isRelativeMode(): boolean;
    get manager(): AbsRelToggleManager;
    render(): JSX.Element;
}
export interface FacetYRangeToggleManager {
    yAxis?: AxisConfig;
}
export declare class FacetYRangeToggle extends React.Component<{
    manager: FacetYRangeToggleManager;
}> {
    onToggle(): void;
    get isYRangeShared(): boolean;
    render(): JSX.Element;
}
export interface ZoomToggleManager {
    zoomToSelection?: boolean;
}
export declare class ZoomToggle extends React.Component<{
    manager: ZoomToggleManager;
}> {
    onToggle(): void;
    render(): JSX.Element;
}
export interface SmallCountriesFilterManager {
    populationFilterOption?: number;
    minPopulationFilter?: number;
}
export declare class FilterSmallCountriesToggle extends React.Component<{
    manager: SmallCountriesFilterManager;
}> {
    private onChange;
    private get manager();
    private get filterOption();
    render(): JSX.Element;
}
export interface FooterControlsManager extends ShareMenuManager {
    isShareMenuActive?: boolean;
    isSelectingData?: boolean;
    availableTabs?: GrapherTabOption[];
    currentTab?: GrapherTabOption;
    isInIFrame?: boolean;
    canonicalUrl?: string;
    hasTimeline?: boolean;
    hasRelatedQuestion?: boolean;
    relatedQuestions: RelatedQuestionsConfig[];
    footerControlsHeight?: number;
    timelineController?: TimelineController;
}
export declare class FooterControls extends React.Component<{
    manager: FooterControlsManager;
}> {
    private get manager();
    onShareMenu(): void;
    private get availableTabs();
    private _getTabsElement;
    render(): JSX.Element;
}
//# sourceMappingURL=Controls.d.ts.map