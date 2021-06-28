import React from "react";
import { GrapherInterface } from "../grapher/core/GrapherInterface";
import { ExplorerProgram } from "../explorer/ExplorerProgram";
import { SerializedGridProgram } from "../clientUtils/owidTypes";
import { Grapher, GrapherManager } from "../grapher/core/Grapher";
import { SlideShowManager } from "../grapher/slideshowController/SlideShowController";
import { ExplorerChoiceParams, ExplorerFullQueryParams } from "./ExplorerConstants";
import { EntityPickerManager } from "../grapher/controls/entityPicker/EntityPickerConstants";
import { SelectionArray } from "../grapher/selection/SelectionArray";
import { SortOrder } from "../coreTable/CoreTableConstants";
import { CoreColumnDef } from "../coreTable/CoreColumnDef";
import { OwidTable } from "../coreTable/OwidTable";
import { Url } from "../clientUtils/urls/Url";
import { ExplorerPageUrlMigrationSpec } from "./urlMigrations/ExplorerPageUrlMigrationSpec";
import { PromiseCache } from "../clientUtils/PromiseCache";
export interface ExplorerProps extends SerializedGridProgram {
    grapherConfigs?: GrapherInterface[];
    queryStr?: string;
    isEmbeddedInAnOwidPage?: boolean;
    isInStandalonePage?: boolean;
    canonicalUrl?: string;
    selection?: SelectionArray;
}
export declare class Explorer extends React.Component<ExplorerProps> implements SlideShowManager<ExplorerChoiceParams>, EntityPickerManager, GrapherManager {
    static renderSingleExplorerOnExplorerPage(program: ExplorerProps, grapherConfigs: GrapherInterface[], urlMigrationSpec?: ExplorerPageUrlMigrationSpec): void;
    private initialQueryParams;
    explorerProgram: ExplorerProgram;
    embedDialogHideControls: boolean;
    selection: SelectionArray;
    grapher?: Grapher;
    setGrapher(grapher: Grapher): void;
    get grapherConfigs(): Map<number, GrapherInterface>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private initSlideshow;
    private persistedGrapherQueryParamsBySelectedRow;
    private reactToUserChangingSelection;
    private setGrapherTable;
    private futureGrapherTable;
    tableLoader: PromiseCache<string | undefined, OwidTable>;
    updateGrapherFromExplorer(): void;
    setSlide(choiceParams: ExplorerFullQueryParams): void;
    private get currentChoiceParams();
    get queryParams(): ExplorerFullQueryParams;
    get currentUrl(): Url;
    private bindToWindow;
    private get panels();
    onChangeChoice: (choiceTitle: string) => (value: string) => void;
    private renderHeaderElement;
    private isNarrow;
    private get isInIFrame();
    private get showExplorerControls();
    private get downloadDataLink();
    private grapherContainerRef;
    private grapherBounds;
    private grapherRef;
    private renderControlBar;
    private renderEntityPicker;
    private onResizeThrottled?;
    private toggleMobileControls;
    private onResize;
    private getGrapherBounds;
    private showMobileControlsPopup;
    private get mobileCustomizeButton();
    private closeControls;
    private get showHeaderElement();
    render(): JSX.Element;
    get editUrl(): string;
    get baseUrl(): string;
    get canonicalUrl(): string;
    get embedDialogUrl(): string;
    embedDialogToggleHideControls(): void;
    get embedDialogAdditionalElements(): JSX.Element;
    get grapherTable(): OwidTable | undefined;
    entityPickerMetric?: string | undefined;
    entityPickerSort?: SortOrder | undefined;
    entityPickerTable?: OwidTable;
    entityPickerTableIsLoading: boolean;
    private futureEntityPickerTable;
    private updateEntityPickerTable;
    setEntityPicker({ metric, sort, }?: {
        metric?: string;
        sort?: SortOrder;
    }): void;
    private tableSlugHasColumnSlug;
    private getTableSlugOfColumnSlug;
    get entityPickerColumnDefs(): CoreColumnDef[];
    get requiredColumnSlugs(): string[];
}
//# sourceMappingURL=Explorer.d.ts.map