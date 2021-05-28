import * as React from "react"
import {
    min,
    max,
    maxBy,
    last,
    flatten,
    excludeUndefined,
    sortBy,
} from "../../clientUtils/Util"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import { Bounds, DEFAULT_BOUNDS } from "../../clientUtils/Bounds"
import { BASE_FONT_SIZE, SeriesName } from "../core/GrapherConstants"
import {
    HorizontalAxisComponent,
    HorizontalAxisGridLines,
} from "../axis/AxisViews"
import { NoDataModal } from "../noDataModal/NoDataModal"
import { AxisConfig } from "../axis/AxisConfig"
import { ChartInterface } from "../chart/ChartInterface"
import { OwidTable } from "../../coreTable/OwidTable"
import { autoDetectYColumnSlugs, makeSelectionArray } from "../chart/ChartUtils"
import { stackSeries } from "./StackedUtils"
import { ChartManager } from "../chart/ChartManager"
import { Color, Time } from "../../clientUtils/owidTypes"
import { StackedPoint, StackedSeries } from "./StackedConstants"
import { ColorSchemes } from "../color/ColorSchemes"
import { EntityName } from "../../coreTable/OwidTableConstants"
import {
    LegendAlign,
    HorizontalCategoricalColorLegend,
    HorizontalColorLegendManager,
} from "../horizontalColorLegend/HorizontalColorLegends"
import { CategoricalBin } from "../color/ColorScaleBin"
import { CoreColumn } from "../../coreTable/CoreTableColumns"
import { TippyIfInteractive } from "../chart/Tippy"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle"
import { isDarkColor } from "../color/ColorUtils"
import { VerticalColorLegendManager } from "../verticalColorLegend/VerticalColorLegend"

const labelToBarPadding = 5

export interface MarimekkoChartManager extends ChartManager {
    endTime?: Time
}

interface Item {
    label: string
    bars: Bar[]
}

interface Bar {
    color: Color
    seriesName: string
    point: StackedPoint<EntityName>
}

interface TooltipProps {
    label: string
    bars: Bar[]
    highlightedSeriesName?: string
    targetTime?: Time
    timeColumn: CoreColumn
    formatColumn: CoreColumn
}

@observer
export class MarimekkoChart
    extends React.Component<{
        bounds?: Bounds
        manager: MarimekkoChartManager
    }>
    implements ChartInterface, HorizontalColorLegendManager {
    base: React.RefObject<SVGGElement> = React.createRef()

    transformTable(table: OwidTable) {
        if (!this.xColumnSlugs.length) return table

        // table = table.filterByEntityNames(
        //     this.selectionArray.selectedEntityNames
        // )

        // TODO: remove this filter once we don't have mixed type columns in datasets
        table = table.replaceNonNumericCellsWithErrorValues(this.xColumnSlugs)

        table = table.dropRowsWithErrorValuesForAllColumns(this.xColumnSlugs)

        this.xColumnSlugs.forEach((slug) => {
            table = table.interpolateColumnWithTolerance(slug)
        })

        if (this.manager.isRelativeMode) {
            table = table.toPercentageFromEachColumnForEachEntityAndTime(
                this.xColumnSlugs
            )
        }

        return table
    }

    @observable focusSeriesName?: SeriesName

    @computed get inputTable() {
        return this.manager.table
    }

    @computed get transformedTable() {
        return (
            this.manager.transformedTable ??
            this.transformTable(this.inputTable)
        )
    }

    @computed private get manager() {
        return this.props.manager
    }

    @computed private get bounds() {
        return (this.props.bounds ?? DEFAULT_BOUNDS).padRight(10)
    }

    @computed private get baseFontSize() {
        return this.manager.baseFontSize ?? BASE_FONT_SIZE
    }

    @computed private get labelStyle() {
        return {
            fontSize: 0.75 * this.baseFontSize,
            fontWeight: 700,
        }
    }

    // Account for the width of the legend
    @computed private get labelWidth() {
        const labels = this.items.map((item) => item.label)
        const longestLabel = maxBy(labels, (d) => d.length)
        return Bounds.forText(longestLabel, this.labelStyle).width
    }

    @computed private get x0() {
        return 0
    }

    @computed private get y0() {
        return 0
    }

    @computed private get allPoints(): StackedPoint<EntityName>[] {
        return flatten(this.series.map((series) => series.points))
    }

    // Now we can work out the main x axis scale
    @computed private get yDomainDefault(): [number, number] {
        const maxValues = this.allPoints.map(
            (point) => point.value + point.valueOffset
        )
        return [
            Math.min(this.y0, min(maxValues) as number),
            Math.max(this.y0, max(maxValues) as number),
        ]
    }

    @computed private get yRange(): [number, number] {
        return [this.bounds.top, this.bounds.bottom - this.labelWidth]
    }

    @computed private get xRange(): [number, number] {
        return [this.bounds.left, this.bounds.right]
    }

    @computed private get yAxisPart() {
        return this.manager.yAxis || new AxisConfig()
    }

    @computed private get xAxisPart() {
        return this.manager.xAxis || new AxisConfig()
    }

    @computed private get axis() {
        // TODO: set up DualAxis here
        const axis = this.yAxisPart.toHorizontalAxis()
        axis.updateDomainPreservingUserSettings(this.xDomainDefault)

        axis.formatColumn = this.yColumns[0] // todo: does this work for columns as series?
        axis.range = this.xRange
        axis.label = ""
        return axis
    }

    @computed private get innerBounds() {
        return this.bounds
            .padLeft(this.labelWidth)
            .padBottom(this.axis.height)
            .padTop(this.legendPaddingTop)
            .padTop(this.legend.height)
    }

    @computed private get selectionArray() {
        return makeSelectionArray(this.manager)
    }

    @computed private get items(): Item[] {
        const entityNames = this.selectionArray.selectedEntityNames
        const items = entityNames
            .map((entityName) => ({
                label: entityName,
                bars: excludeUndefined(
                    this.series.map((series) => {
                        const point = series.points.find(
                            (point) => point.position === entityName
                        )
                        if (!point) return undefined
                        return {
                            point,
                            color: series.color,
                            seriesName: series.seriesName,
                        }
                    })
                ),
            }))
            .filter((item) => item.bars.length)

        if (this.manager.isRelativeMode) {
            // TODO: This is more of a stopgap to prevent the chart from being super jumpy in
            // relative mode. Once we have an option to sort by a specific metric, that'll help.
            // Until then, we're sorting by label to prevent any jumping.
            return sortBy(items, (item) => item.label)
        } else {
            return sortBy(items, (item) => {
                const lastPoint = last(item.bars)?.point
                if (!lastPoint) return 0
                return lastPoint.valueOffset + lastPoint.value
            }).reverse()
        }
    }

    @computed private get barHeight() {
        return (0.8 * this.innerBounds.height) / this.items.length
    }

    @computed private get barSpacing() {
        return this.innerBounds.height / this.items.length - this.barHeight
    }

    // legend props

    @computed get legendPaddingTop(): number {
        return this.baseFontSize
    }

    @computed get legendX(): number {
        return this.bounds.x
    }

    @computed get categoryLegendY(): number {
        return this.bounds.top
    }

    @computed get legendWidth(): number {
        return this.bounds.width
    }

    @computed get legendAlign(): LegendAlign {
        return LegendAlign.left
    }

    @computed get fontSize(): number {
        return this.baseFontSize
    }

    @computed get categoricalLegendData(): CategoricalBin[] {
        return this.series.map((series, index) => {
            return new CategoricalBin({
                index,
                value: series.seriesName,
                label: series.seriesName,
                color: series.color,
            })
        })
    }

    @action.bound onLegendMouseOver(bin: CategoricalBin) {
        this.focusSeriesName = bin.value
    }

    @action.bound onLegendMouseLeave() {
        this.focusSeriesName = undefined
    }

    @computed private get legend(): HorizontalCategoricalColorLegend {
        return new HorizontalCategoricalColorLegend({ manager: this })
    }

    @computed private get formatColumn(): CoreColumn {
        return this.yColumns[0]
    }

    render() {
        if (this.failMessage)
            return (
                <NoDataModal
                    manager={this.manager}
                    bounds={this.bounds}
                    message={this.failMessage}
                />
            )

        const { bounds, axis, innerBounds, barHeight, barSpacing } = this

        let yOffset = innerBounds.top + barHeight / 2

        return (
            <g ref={this.base} className="MarimekkoChart">
                <rect
                    x={bounds.left}
                    y={bounds.top}
                    width={bounds.width}
                    height={bounds.height}
                    opacity={0}
                    fill="rgba(255,255,255,0)"
                />
                <HorizontalAxisComponent
                    bounds={bounds}
                    axis={axis}
                    axisPosition={innerBounds.bottom}
                />
                <HorizontalAxisGridLines
                    horizontalAxis={axis}
                    bounds={innerBounds}
                />
                <HorizontalCategoricalColorLegend manager={this} />
                {this.items.map(({ label, bars }) => {
                    // Using transforms for positioning to enable better (subpixel) transitions
                    // Width transitions don't work well on iOS Safari – they get interrupted and
                    // it appears very slow. Also be careful with negative bar charts.
                    const tooltipProps = {
                        label,
                        bars,
                        targetTime: this.manager.endTime,
                        timeColumn: this.inputTable.timeColumn,
                        formatColumn: this.formatColumn,
                    }

                    const result = (
                        <g
                            key={label}
                            className="bar"
                            transform={`translate(0, ${yOffset})`}
                        >
                            <TippyIfInteractive
                                lazy
                                isInteractive={
                                    !this.manager.isExportingtoSvgOrPng
                                }
                                hideOnClick={false}
                                content={
                                    <MarimekkoChart.Tooltip {...tooltipProps} />
                                }
                            >
                                <text
                                    x={0}
                                    y={0}
                                    transform={`translate(${
                                        axis.place(this.x0) - labelToBarPadding
                                    }, 0)`}
                                    fill="#555"
                                    dominantBaseline="middle"
                                    textAnchor="end"
                                    {...this.labelStyle}
                                >
                                    {label}
                                </text>
                            </TippyIfInteractive>
                            {bars.map((bar) =>
                                this.renderBar(bar, {
                                    ...tooltipProps,
                                    highlightedSeriesName: bar.seriesName,
                                })
                            )}
                        </g>
                    )

                    yOffset += barHeight + barSpacing

                    return result
                })}
            </g>
        )
    }

    private renderBar(bar: Bar, tooltipProps: TooltipProps) {
        const { axis, formatColumn, focusSeriesName, barHeight } = this
        const { point, color, seriesName } = bar

        const isFaint =
            focusSeriesName !== undefined && focusSeriesName !== seriesName
        const barX = axis.place(this.x0 + point.valueOffset)
        const barWidth = axis.place(point.value) - axis.place(this.x0)

        // Compute how many decimal places we should show.
        // Basically, this makes us show 2 significant digits, or no decimal places if the number
        // is big enough already.
        const dp = Math.ceil(-Math.log10(point.value) + 1)
        const barLabel = formatColumn.formatValueShort(point.value, {
            numDecimalPlaces: isFinite(dp) && dp >= 0 ? dp : 0,
        })
        const labelBounds = Bounds.forText(barLabel, {
            fontSize: 0.7 * this.baseFontSize,
        })
        // Check that we have enough space to show the bar label
        const showLabelInsideBar =
            labelBounds.width < 0.85 * barWidth &&
            labelBounds.height < 0.85 * barHeight
        const labelColor = isDarkColor(color) ? "#fff" : "#000"

        return (
            <TippyIfInteractive
                lazy
                isInteractive={!this.manager.isExportingtoSvgOrPng}
                key={seriesName}
                hideOnClick={false}
                content={<MarimekkoChart.Tooltip {...tooltipProps} />}
            >
                <g>
                    <rect
                        x={0}
                        y={0}
                        transform={`translate(${barX}, ${-barHeight / 2})`}
                        width={barWidth}
                        height={barHeight}
                        fill={color}
                        opacity={isFaint ? 0.1 : 0.85}
                        style={{
                            transition: "height 200ms ease",
                        }}
                    />
                    {showLabelInsideBar && (
                        <text
                            x={barX + barWidth / 2}
                            y={0}
                            width={barWidth}
                            height={barHeight}
                            fill={labelColor}
                            opacity={isFaint ? 0 : 1}
                            fontSize="0.7em"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {barLabel}
                        </text>
                    )}
                </g>
            </TippyIfInteractive>
        )
    }

    private static Tooltip(props: TooltipProps) {
        let hasTimeNotice = false

        return (
            <table
                style={{
                    lineHeight: "1em",
                    whiteSpace: "normal",
                    borderSpacing: "0.5em",
                }}
            >
                <tbody>
                    <tr>
                        <td colSpan={4} style={{ color: "#111" }}>
                            <strong>{props.label}</strong>
                        </td>
                    </tr>
                    {props.bars.map((bar) => {
                        const { highlightedSeriesName } = props
                        const squareColor = bar.color
                        const isHighlighted =
                            bar.seriesName === highlightedSeriesName
                        const isFaint =
                            highlightedSeriesName !== undefined &&
                            !isHighlighted
                        const shouldShowTimeNotice =
                            bar.point.value !== undefined &&
                            bar.point.time !== props.targetTime
                        hasTimeNotice ||= shouldShowTimeNotice

                        return (
                            <tr
                                key={`${bar.seriesName}`}
                                style={{
                                    color: isHighlighted
                                        ? "#000"
                                        : isFaint
                                        ? "#707070"
                                        : "#444",
                                    fontWeight: isHighlighted
                                        ? "bold"
                                        : undefined,
                                }}
                            >
                                <td>
                                    <div
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            backgroundColor: squareColor,
                                            display: "inline-block",
                                        }}
                                    />
                                </td>
                                <td
                                    style={{
                                        paddingRight: "0.8em",
                                        fontSize: "0.9em",
                                    }}
                                >
                                    {bar.seriesName}
                                </td>
                                <td
                                    style={{
                                        textAlign: "right",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {bar.point.value === undefined
                                        ? "No data"
                                        : props.formatColumn.formatValueShort(
                                              bar.point.value,
                                              {
                                                  noTrailingZeroes: false,
                                              }
                                          )}
                                </td>
                                {shouldShowTimeNotice && (
                                    <td
                                        style={{
                                            fontWeight: "normal",
                                            color: "#707070",
                                            fontSize: "0.8em",
                                            whiteSpace: "nowrap",
                                            paddingLeft: "8px",
                                        }}
                                    >
                                        <span className="icon">
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                                style={{
                                                    marginRight: "0.25em",
                                                }}
                                            />{" "}
                                        </span>
                                        {props.timeColumn.formatValue(
                                            bar.point.time
                                        )}
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                    {hasTimeNotice && (
                        <tr>
                            <td
                                colSpan={4}
                                style={{
                                    color: "#707070",
                                    fontSize: "0.8em",
                                    paddingTop: "10px",
                                }}
                            >
                                <div style={{ display: "flex" }}>
                                    <span
                                        className="icon"
                                        style={{ marginRight: "0.5em" }}
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />{" "}
                                    </span>
                                    <span>
                                        No data available for{" "}
                                        {props.timeColumn.formatValue(
                                            props.targetTime
                                        )}
                                        . Showing closest available data point
                                        instead.
                                    </span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }

    @computed get failMessage() {
        const column = this.yColumns[0]

        if (!column) return "No column to chart"

        if (!this.selectionArray.hasSelection) return `No data selected`

        // TODO is it better to use .series for this check?
        return this.yColumns.every((col) => col.isEmpty)
            ? `No matching data in columns ${this.xColumnSlugs.join(", ")}`
            : ""
    }

    @computed protected get xColumnSlugs() {
        return (
            this.manager.yColumnSlugsInSelectionOrder ??
            autoDetectYColumnSlugs(this.manager)
        )
    }

    @computed protected get yColumns() {
        return this.transformedTable.getColumns(this.xColumnSlugs)
    }

    @computed private get colorScheme() {
        return (
            (this.manager.baseColorScheme
                ? ColorSchemes[this.manager.baseColorScheme]
                : undefined) ?? ColorSchemes["owid-distinct"]
        )
    }

    @computed private get unstackedSeries(): StackedSeries<EntityName>[] {
        return (
            this.yColumns
                .map((col, i) => {
                    return {
                        seriesName: col.displayName,
                        color:
                            col.def.color ??
                            this.colorScheme.getColors(this.yColumns.length)[i],
                        points: col.owidRows.map((row) => ({
                            time: row.time,
                            position: row.entityName,
                            value: row.value,
                            valueOffset: 0,
                        })),
                    }
                })
                // Do not plot columns without data
                .filter((series) => series.points.length > 0)
        )
    }

    @computed get series(): readonly StackedSeries<EntityName>[] {
        return stackSeries(this.unstackedSeries)
    }
}
