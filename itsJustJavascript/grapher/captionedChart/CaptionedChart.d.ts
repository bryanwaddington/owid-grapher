import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { ChartTypeName, GrapherTabOption } from "../core/GrapherConstants";
import { MapChartManager } from "../mapCharts/MapChartConstants";
import { ChartManager } from "../chart/ChartManager";
import { SmallCountriesFilterManager, AbsRelToggleManager, HighlightToggleManager, FacetYRangeToggleManager } from "../controls/Controls";
import { FooterManager } from "../footer/FooterManager";
import { HeaderManager } from "../header/HeaderManager";
import { SelectionArray } from "../selection/SelectionArray";
import { EntityName } from "../../coreTable/OwidTableConstants";
export interface CaptionedChartManager extends ChartManager, MapChartManager, SmallCountriesFilterManager, HighlightToggleManager, AbsRelToggleManager, FooterManager, HeaderManager, FacetYRangeToggleManager {
    containerElement?: HTMLDivElement;
    tabBounds?: Bounds;
    fontSize?: number;
    tab?: GrapherTabOption;
    type?: ChartTypeName;
    typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart?: ChartTypeName;
    isReady?: boolean;
    whatAreWeWaitingFor?: string;
    entityType?: string;
    entityTypePlural?: string;
    showSmallCountriesFilterToggle?: boolean;
    showYScaleToggle?: boolean;
    showXScaleToggle?: boolean;
    showZoomToggle?: boolean;
    showAbsRelToggle?: boolean;
    showFacetYRangeToggle?: boolean;
    showHighlightToggle?: boolean;
    showChangeEntityButton?: boolean;
    showAddEntityButton?: boolean;
    showSelectEntitiesButton?: boolean;
}
interface CaptionedChartProps {
    manager: CaptionedChartManager;
    bounds?: Bounds;
    maxWidth?: number;
}
export declare class CaptionedChart extends React.Component<CaptionedChartProps> {
    protected get manager(): CaptionedChartManager;
    private get containerElement();
    private get maxWidth();
    protected get header(): Header;
    protected get footer(): Footer;
    protected get chartHeight(): number;
    protected get isMapTab(): boolean;
    protected get bounds(): Bounds;
    protected get boundsForChart(): Bounds;
    get isFaceted(): boolean;
    renderChart(): JSX.Element;
    componentDidMount(): void;
    startSelecting(): void;
    get controls(): JSX.Element[];
    get selectionArray(): SelectionArray | EntityName[] | undefined;
    private renderControlsRow;
    private renderLoadingIndicator;
    render(): JSX.Element;
    protected get svgProps(): {
        xmlns: string;
        version: string;
        style: {
            fontFamily: string;
            fontSize: number;
            backgroundColor: string;
            textRendering: any;
            WebkitFontSmoothing: string;
        };
    };
}
export declare class StaticCaptionedChart extends CaptionedChart {
    constructor(props: CaptionedChartProps);
    private get paddedBounds();
    protected get boundsForChart(): Bounds;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=CaptionedChart.d.ts.map