import { Bounds } from "../../clientUtils/Bounds";
import { TextWrap } from "../text/TextWrap";
import { AxisConfig } from "./AxisConfig";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
import { ValueRange } from "../../coreTable/CoreTableConstants";
import { ScaleType } from "../../clientUtils/owidTypes";
import { TickFormattingOptions } from "../../clientUtils/formatValue";
interface Tickmark {
    value: number;
    priority: number;
    faint?: boolean;
    gridLineOnly?: boolean;
    isFirstOrLastTick?: boolean;
}
declare abstract class AbstractAxis {
    config: AxisConfig;
    domain: ValueRange;
    formatColumn?: CoreColumn;
    hideFractionalTicks: boolean;
    hideGridlines: boolean;
    range: ValueRange;
    private _scaleType?;
    private _label?;
    constructor(config: AxisConfig);
    get hideAxis(): boolean;
    updateDomainPreservingUserSettings(domain: [number | undefined, number | undefined]): this;
    get fontSize(): number;
    get scaleType(): ScaleType;
    set scaleType(value: ScaleType);
    get label(): string;
    set label(value: string);
    get canChangeScaleType(): boolean | undefined;
    _update(parentAxis: AbstractAxis): this;
    private get d3_scale();
    get rangeSize(): number;
    get rangeMax(): number;
    get rangeMin(): number;
    private get maxLogLines();
    getTickValues(): Tickmark[];
    private getTickFormattingOptions;
    getFormattedTicks(): string[];
    place(value: number): number;
    get tickFontSize(): number;
    protected doIntersect(bounds: Bounds, bounds2: Bounds): boolean;
    get ticks(): number[];
    formatTick(tick: number, formattingOptionsOverride?: TickFormattingOptions): string;
    private get tickPlacements();
    get labelFontSize(): number;
    protected get baseTicks(): Tickmark[];
    abstract get labelWidth(): number;
    protected abstract placeTick(tickValue: number, bounds: Bounds): {
        x: number;
        y: number;
    };
    get labelTextWrap(): TextWrap | undefined;
}
export declare class HorizontalAxis extends AbstractAxis {
    clone(): HorizontalAxis;
    get labelOffset(): number;
    get labelWidth(): number;
    get height(): number;
    protected get baseTicks(): Tickmark[];
    protected placeTick(tickValue: number, bounds: Bounds): {
        x: number;
        y: number;
    };
    protected doIntersect(bounds: Bounds, bounds2: Bounds): boolean;
}
export declare class VerticalAxis extends AbstractAxis {
    get labelWidth(): number;
    clone(): VerticalAxis;
    get labelOffset(): number;
    get width(): number;
    get height(): number;
    protected placeTick(tickValue: number): {
        y: number;
        x: number;
    };
}
interface DualAxisProps {
    bounds?: Bounds;
    horizontalAxis: HorizontalAxis;
    verticalAxis: VerticalAxis;
}
export declare class DualAxis {
    private props;
    constructor(props: DualAxisProps);
    get horizontalAxis(): HorizontalAxis;
    get verticalAxis(): VerticalAxis;
    private get horizontalAxisHeight();
    private get verticalAxisWidth();
    get innerBounds(): Bounds;
    get bounds(): Bounds;
}
export {};
//# sourceMappingURL=Axis.d.ts.map