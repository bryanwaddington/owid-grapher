import * as React from "react";
import { IReactionDisposer } from "mobx";
import { ColorScale } from "../color/ColorScale";
import { VNode } from "../../clientUtils/Util";
import { QueryParams } from "../../clientUtils/urls/UrlUtils";
import { ChartTypeName, GrapherTabOption, ScaleType, StackMode, DimensionProperty, EntitySelectionMode, HighlightToggleConfig, ScatterPointLabelStrategy, RelatedQuestionsConfig, FacetStrategy, SeriesColorMap } from "../core/GrapherConstants";
import { LegacyChartDimensionInterface, LegacyVariablesAndEntityKey } from "./LegacyVariableCode";
import { ChartDimension, LegacyDimensionsManager } from "../chart/ChartDimension";
import { Bounds } from "../../clientUtils/Bounds";
import { TooltipProps, TooltipManager } from "../tooltip/TooltipProps";
import { TimeBounds, TimeBound } from "../../clientUtils/TimeBounds";
import { GrapherInterface, GrapherQueryParams, LegacyGrapherInterface } from "../core/GrapherInterface";
import { DimensionSlot } from "../chart/DimensionSlot";
import { LogoOption } from "../captionedChart/Logos";
import { AxisConfig, FontSizeManager } from "../axis/AxisConfig";
import { ColorScaleConfig } from "../color/ColorScaleConfig";
import { MapConfig } from "../mapCharts/MapConfig";
import { ComparisonLineConfig } from "../scatterCharts/ComparisonLine";
import { ColumnSlug, ColumnSlugs, Time } from "../../coreTable/CoreTableConstants";
import { ChartManager } from "../chart/ChartManager";
import { AbsRelToggleManager, FooterControlsManager, HighlightToggleManager, SmallCountriesFilterManager } from "../controls/Controls";
import { DownloadTabManager } from "../downloadTab/DownloadTab";
import "d3-transition";
import { SourcesTabManager } from "../sourcesTab/SourcesTab";
import { DataTableManager } from "../dataTable/DataTable";
import { MapChartManager } from "../mapCharts/MapChartConstants";
import { DiscreteBarChartManager } from "../barCharts/DiscreteBarChartConstants";
import { ShareMenuManager } from "../controls/ShareMenu";
import { CaptionedChartManager } from "../captionedChart/CaptionedChart";
import { TimelineController, TimelineManager } from "../timeline/TimelineController";
import { EntityId, EntityName } from "../../coreTable/OwidTableConstants";
import { OwidTable } from "../../coreTable/OwidTable";
import { SlideShowController } from "../slideshowController/SlideShowController";
import { ColorSchemeName } from "../color/ColorConstants";
import { SelectionArray } from "../selection/SelectionArray";
import { ScatterPlotManager } from "../scatterCharts/ScatterPlotChartConstants";
import { GrapherAnalytics } from "./GrapherAnalytics";
import { Annotation } from "../../clientUtils/owidTypes";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
import { ChartInterface } from "../chart/ChartInterface";
export interface GrapherProgrammaticInterface extends GrapherInterface {
    owidDataset?: LegacyVariablesAndEntityKey;
    manuallyProvideData?: boolean;
    hideEntityControls?: boolean;
    queryStr?: string;
    isMediaCard?: boolean;
    bounds?: Bounds;
    table?: OwidTable;
    bakedGrapherURL?: string;
    adminBaseUrl?: string;
    env?: string;
    getGrapherInstance?: (instance: Grapher) => void;
    enableKeyboardShortcuts?: boolean;
    bindUrlToWindow?: boolean;
    isEmbeddedInAnOwidPage?: boolean;
    manager?: GrapherManager;
}
export interface GrapherManager {
    canonicalUrl?: string;
    embedDialogUrl?: string;
    embedDialogAdditionalElements?: React.ReactElement;
    selection?: SelectionArray;
    editUrl?: string;
}
export declare class Grapher extends React.Component<GrapherProgrammaticInterface> implements TimelineManager, ChartManager, FontSizeManager, CaptionedChartManager, SourcesTabManager, DownloadTabManager, DiscreteBarChartManager, LegacyDimensionsManager, ShareMenuManager, SmallCountriesFilterManager, HighlightToggleManager, AbsRelToggleManager, TooltipManager, FooterControlsManager, DataTableManager, ScatterPlotManager, MapChartManager {
    type: ChartTypeName;
    id?: number;
    version: number;
    slug?: string;
    title?: string;
    subtitle: string;
    sourceDesc?: string;
    note: string;
    hideTitleAnnotation?: boolean;
    minTime?: TimeBound;
    maxTime?: TimeBound;
    timelineMinTime?: Time;
    timelineMaxTime?: Time;
    addCountryMode: EntitySelectionMode;
    highlightToggle?: HighlightToggleConfig;
    stackMode: StackMode;
    hideLegend?: boolean;
    logo?: LogoOption;
    hideLogo?: boolean;
    hideRelativeToggle?: boolean | undefined;
    entityType: string;
    entityTypePlural: string;
    hideTimeline?: boolean;
    zoomToSelection?: boolean;
    minPopulationFilter?: number;
    showYearLabels?: boolean;
    hasChartTab: boolean;
    hasMapTab: boolean;
    tab: GrapherTabOption;
    overlay?: GrapherTabOption;
    internalNotes: string;
    variantName?: string;
    originUrl: string;
    isPublished?: boolean;
    baseColorScheme?: ColorSchemeName;
    invertColorScheme?: boolean;
    hideLinesOutsideTolerance?: boolean;
    hideConnectedScatterLines?: boolean;
    scatterPointLabelStrategy?: ScatterPointLabelStrategy;
    compareEndPointsOnly?: boolean;
    matchingEntitiesOnly?: boolean;
    showFacetYRangeToggle: boolean;
    xAxis: AxisConfig;
    yAxis: AxisConfig;
    colorScale: ColorScaleConfig;
    map: MapConfig;
    dimensions: ChartDimension[];
    ySlugs?: ColumnSlugs;
    xSlug?: ColumnSlug;
    colorSlug?: ColumnSlug;
    sizeSlug?: ColumnSlug;
    tableSlugs?: ColumnSlugs;
    backgroundSeriesLimit?: number;
    selectedEntityNames: EntityName[];
    selectedEntityColors: {
        [entityName: string]: string;
    };
    selectedEntityIds: EntityId[];
    excludedEntities?: number[];
    comparisonLines: ComparisonLineConfig[];
    relatedQuestions: RelatedQuestionsConfig[];
    annotation?: Annotation;
    owidDataset?: LegacyVariablesAndEntityKey;
    manuallyProvideData?: boolean | undefined;
    isDev: boolean;
    analytics: GrapherAnalytics;
    isEditor: boolean;
    bakedGrapherURL: string;
    adminBaseUrl: string;
    inputTable: OwidTable;
    legacyConfigAsAuthored: Partial<LegacyGrapherInterface>;
    get dataTableSlugs(): ColumnSlug[];
    /**
     * todo: factor this out and make more RAII.
     *
     * Explorers create 1 Grapher instance, but as the user clicks around the Explorer loads other author created Graphers.
     * But currently some Grapher features depend on knowing how the current state is different than the "authored state".
     * So when an Explorer updates the grapher, it also needs to update this "original state".
     */
    setAuthoredVersion(config: Partial<LegacyGrapherInterface>): void;
    updateAuthoredVersion(config: Partial<LegacyGrapherInterface>): void;
    constructor(propsWithGrapherInstanceGetter?: GrapherProgrammaticInterface);
    toObject(): GrapherInterface;
    downloadData(): void;
    updateFromObject(obj?: GrapherProgrammaticInterface): void;
    populateFromQueryParams(params: GrapherQueryParams): void;
    private setTimeFromTimeQueryParam;
    private get isChartOrMapTab();
    private get isOnMapTab();
    get tableForSelection(): OwidTable;
    get tableAfterAuthorTimelineFilter(): OwidTable;
    windowQueryParams(str?: string): QueryParams;
    private get tableAfterAuthorTimelineAndActiveChartTransform();
    get chartInstance(): ChartInterface;
    get chartInstanceExceptMap(): ChartInterface;
    get table(): OwidTable;
    get tableAfterAuthorTimelineAndActiveChartTransformAndPopulationFilter(): OwidTable;
    private get tableAfterAllTransformsAndFilters();
    get transformedTable(): OwidTable;
    isMediaCard: boolean;
    isExportingtoSvgOrPng: boolean;
    tooltip?: TooltipProps;
    isPlaying: boolean;
    isSelectingData: boolean;
    private get isStaging();
    get editUrl(): string | undefined;
    private populationFilterToggleOption;
    get populationFilterOption(): number;
    private get hasCountriesSmallerThanFilterOption();
    useTimelineDomains: boolean;
    /**
     * Whether the chart is rendered in an Admin context (e.g. on owid.cloud).
     */
    get useAdminAPI(): boolean;
    /**
     * Whether the user viewing the chart is an admin and we should show admin controls,
     * like the "Edit" option in the share menu.
     */
    get showAdminControls(): boolean;
    private downloadLegacyDataFromOwidVariableIds;
    receiveLegacyData(json: LegacyVariablesAndEntityKey): void;
    private _setInputTable;
    rebuildInputOwidTable(): void;
    private legacyVariableDataJson?;
    private _receiveLegacyDataAndApplySelection;
    appendNewEntitySelectionOptions(): void;
    private applyOriginalSelectionAsAuthored;
    private _baseFontSize;
    get baseFontSize(): number;
    set baseFontSize(val: number);
    get isReady(): boolean;
    get whatAreWeWaitingFor(): string;
    get newSlugs(): string[];
    private get loadingDimensions();
    get isInIFrame(): boolean;
    get times(): Time[];
    get startHandleTimeBound(): TimeBound;
    set startHandleTimeBound(newValue: TimeBound);
    set endHandleTimeBound(newValue: TimeBound);
    get endHandleTimeBound(): TimeBound;
    seriesColorMap: SeriesColorMap;
    get startTime(): Time | undefined;
    get endTime(): Time | undefined;
    private get onlySingleTimeSelectionPossible();
    get shouldLinkToOwid(): boolean;
    private get variableIds();
    private get dataFileName();
    get dataUrl(): string;
    externalCsvLink: string;
    get hasOWIDLogo(): boolean;
    get hasFatalErrors(): boolean;
    disposers: IReactionDisposer[];
    dispose(): void;
    get fontSize(): number;
    private ensureValidConfigWhenEditing;
    private get validDimensions();
    get originUrlWithProtocol(): string;
    get overlayTab(): GrapherTabOption | undefined;
    get currentTab(): GrapherTabOption;
    set currentTab(desiredTab: GrapherTabOption);
    get timelineHandleTimeBounds(): TimeBounds;
    set timelineHandleTimeBounds(value: TimeBounds);
    get dimensionSlots(): DimensionSlot[];
    get filledDimensions(): ChartDimension[];
    addDimension(config: LegacyChartDimensionInterface): void;
    setDimensionsForProperty(property: DimensionProperty, newConfigs: LegacyChartDimensionInterface[]): void;
    setDimensionsFromConfigs(configs: LegacyChartDimensionInterface[]): void;
    get displaySlug(): string;
    get availableTabs(): GrapherTabOption[];
    get currentTitle(): string;
    get hasTimeline(): boolean;
    private get areHandlesOnSameTime();
    get mapColumnSlug(): string;
    getColumnForProperty(property: DimensionProperty): CoreColumn | undefined;
    getSlugForProperty(property: DimensionProperty): string | undefined;
    get yColumns(): CoreColumn[];
    get yColumnSlugsInSelectionOrder(): string[];
    get yColumnSlugs(): string[];
    get yColumnSlug(): string | undefined;
    get xColumnSlug(): string | undefined;
    get sizeColumnSlug(): string | undefined;
    get colorColumnSlug(): string | undefined;
    get yScaleType(): ScaleType | undefined;
    get xScaleType(): ScaleType | undefined;
    private get timeTitleSuffix();
    get sourcesLine(): string;
    get activeColumnSlugs(): string[];
    get columnsWithSources(): CoreColumn[];
    private get defaultSourcesLine();
    private get axisDimensions();
    private get yColumnsFromDimensionsOrSlugsOrAuto();
    private get defaultTitle();
    get displayTitle(): string;
    get object(): GrapherInterface;
    get typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart(): ChartTypeName;
    get isLineChart(): boolean;
    get isScatter(): boolean;
    get isTimeScatter(): boolean;
    get isStackedArea(): boolean;
    get isSlopeChart(): boolean;
    get isDiscreteBar(): boolean;
    get isStackedBar(): boolean;
    get isStackedDiscreteBar(): boolean;
    get isLineChartThatTurnedIntoDiscreteBar(): boolean;
    get activeColorScale(): ColorScale | undefined;
    get activeColorScaleExceptMap(): ColorScale | undefined;
    get supportsMultipleYColumns(): boolean;
    private get xDimension();
    get xOverrideTime(): number | undefined;
    set xOverrideTime(value: number | undefined);
    get idealBounds(): Bounds;
    get hasYDimension(): boolean;
    get staticSVG(): string;
    get mapConfig(): MapConfig;
    get cacheTag(): string;
    get mapIsClickable(): boolean;
    get relativeToggleLabel(): string;
    get isRelativeMode(): boolean;
    get canToggleRelativeMode(): boolean;
    get mappableData(): import("../../coreTable/OwidTableConstants").LegacyOwidRow<any>[];
    static renderGrapherIntoContainer(config: GrapherProgrammaticInterface, containerNode: Element): Grapher | null;
    static renderSingleGrapherOnGrapherPage(jsonConfig: GrapherInterface): void;
    get isMobile(): boolean;
    private get bounds();
    private get isPortrait();
    private get widthForDeviceOrientation();
    private get heightForDeviceOrientation();
    private get useIdealBounds();
    private get scaleToFitIdeal();
    private get renderWidth();
    private get renderHeight();
    get tabBounds(): Bounds;
    private popups;
    base: React.RefObject<HTMLDivElement>;
    get containerElement(): HTMLDivElement | undefined;
    private hasBeenVisible;
    private uncaughtError?;
    setError(err: Error): void;
    clearErrors(): void;
    addPopup(vnode: VNode): void;
    removePopup(vnodeType: any): void;
    private get isOnTableTab();
    private renderPrimaryTab;
    private renderOverlayTab;
    private get commandPalette();
    formatTimeFn(time: Time): string;
    private toggleTabCommand;
    private togglePlayingCommand;
    selection: SelectionArray;
    get availableEntities(): {
        entityName: any;
        entityId: number | undefined;
        entityCode: string | undefined;
    }[];
    private get keyboardShortcuts();
    slideShow?: SlideShowController<any>;
    private toggleTimelineCommand;
    private toggleFilterAllCommand;
    private toggleYScaleTypeCommand;
    private toggleFacetStrategy;
    facet?: FacetStrategy;
    private get hasMultipleYColumns();
    get selectedColumnSlugs(): ColumnSlug[];
    private get availableFacetStrategies();
    private disableAutoFaceting;
    get facetStrategy(): FacetStrategy | undefined;
    randomSelection(num: number): void;
    private renderError;
    resetAnnotation(): void;
    renderAnnotation(annotation: Annotation | undefined): void;
    render(): JSX.Element | undefined;
    private renderReady;
    private checkVisibility;
    private setBaseFontSize;
    private bindToWindow;
    componentDidMount(): void;
    private _shortcutsBound;
    private bindKeyboardShortcuts;
    private unbindKeyboardShortcuts;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    componentDidCatch(error: Error, info: any): void;
    isShareMenuActive: boolean;
    get hasRelatedQuestion(): boolean;
    private get footerControlsLines();
    get footerControlsHeight(): number;
    clearQueryParams(): void;
    reset(): void;
    debounceMode: boolean;
    get allParams(): GrapherQueryParams;
    private get selectedEntitiesIfDifferentThanAuthors();
    get changedParams(): Partial<GrapherQueryParams>;
    private get authorsVersion();
    get queryStr(): string;
    get baseUrl(): string | undefined;
    private get manager();
    get canonicalUrl(): string | undefined;
    get embedUrl(): string | undefined;
    get embedDialogAdditionalElements(): React.ReactElement | undefined;
    private get hasUserChangedTimeHandles();
    private get hasUserChangedMapTimeHandle();
    get timeParam(): string | undefined;
    msPerTick: number;
    timelineController: TimelineController;
    onPlay(): void;
    onStartPlayOrDrag(): void;
    onStopPlayOrDrag(): void;
    get disablePlay(): boolean;
    formatTime(value: Time): string;
    get showSmallCountriesFilterToggle(): boolean;
    get showYScaleToggle(): boolean | undefined;
    get showXScaleToggle(): boolean | undefined;
    get showZoomToggle(): boolean;
    get showAbsRelToggle(): boolean;
    get showHighlightToggle(): boolean;
    get showChangeEntityButton(): boolean;
    get showAddEntityButton(): boolean;
    get showSelectEntitiesButton(): boolean;
    get canSelectMultipleEntities(): boolean;
    private get numSelectableEntityNames();
    get canChangeEntity(): boolean;
    get startSelectingWhenLineClicked(): boolean;
    hideEntityControls: boolean;
}
export declare const getErrorMessageRelatedQuestionUrl: (question: RelatedQuestionsConfig) => string | undefined;
//# sourceMappingURL=Grapher.d.ts.map