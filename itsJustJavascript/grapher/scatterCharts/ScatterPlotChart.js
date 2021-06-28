"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterPlotChart = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const GrapherConstants_1 = require("../core/GrapherConstants");
const ConnectedScatterLegend_1 = require("./ConnectedScatterLegend");
const VerticalColorLegend_1 = require("../verticalColorLegend/VerticalColorLegend");
const AxisViews_1 = require("../axis/AxisViews");
const Axis_1 = require("../axis/Axis");
const ComparisonLine_1 = require("./ComparisonLine");
const ColorScale_1 = require("../color/ColorScale");
const AxisConfig_1 = require("../axis/AxisConfig");
const ScatterTooltip_1 = require("./ScatterTooltip");
const ScatterPointsWithLabels_1 = require("./ScatterPointsWithLabels");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
const ChartUtils_1 = require("../chart/ChartUtils");
const ColorConstants_1 = require("../color/ColorConstants");
const ErrorValues_1 = require("../../coreTable/ErrorValues");
const ColorScaleConfig_1 = require("../color/ColorScaleConfig");
let ScatterPlotChart = class ScatterPlotChart extends React.Component {
    constructor() {
        super(...arguments);
        this.colorScale = new ColorScale_1.ColorScale(this);
        this.defaultBaseColorScheme = ColorConstants_1.ColorSchemeName.continents;
        this.defaultNoDataColor = "#959595";
    }
    transformTable(table) {
        var _a, _b, _c;
        const { backgroundSeriesLimit, excludedEntities, addCountryMode, } = this.manager;
        if (addCountryMode === GrapherConstants_1.EntitySelectionMode.Disabled ||
            addCountryMode === GrapherConstants_1.EntitySelectionMode.SingleEntity) {
            table = table.filterByEntityNames(this.selectionArray.selectedEntityNames);
        }
        if (excludedEntities) {
            const excludedEntityIdsSet = new Set(excludedEntities);
            table = table.columnFilter(OwidTableConstants_1.OwidTableSlugs.entityId, (entityId) => !excludedEntityIdsSet.has(entityId), `Excluded entity ids specified by author: ${excludedEntities.join(", ")}`);
        }
        // Allow authors to limit the # of background entities to get better perf and clearer charts.
        if (backgroundSeriesLimit) {
            const selectedSeriesNames = new Set(this.selectionArray.selectedEntityNames);
            // Todo: implement a better strategy for picking the entities to show for context. Maybe a couple per decile?
            const backgroundSeriesNames = new Set(Util_1.sampleFrom(table.availableEntityNames.filter((name) => !selectedSeriesNames.has(name)), backgroundSeriesLimit, 123));
            table = table.columnFilter(table.entityNameSlug, (name) => selectedSeriesNames.has(name) ||
                backgroundSeriesNames.has(name), `Capped background series at ${backgroundSeriesLimit}`);
        }
        if (this.xScaleType === GrapherConstants_1.ScaleType.log && this.xColumnSlug)
            table = table.replaceNonPositiveCellsForLogScale([this.xColumnSlug]);
        if (this.yScaleType === GrapherConstants_1.ScaleType.log && this.yColumnSlug)
            table = table.replaceNonPositiveCellsForLogScale([this.yColumnSlug]);
        if (this.sizeColumnSlug) {
            // The tolerance on the size column is ignored. If we want to change this in the future
            // we need to check all charts for regressions.
            table = table.interpolateColumnWithTolerance(this.sizeColumnSlug, Infinity);
        }
        if (this.colorColumnSlug) {
            const tolerance = (_c = (_b = (_a = table.get(this.colorColumnSlug)) === null || _a === void 0 ? void 0 : _a.display) === null || _b === void 0 ? void 0 : _b.tolerance) !== null && _c !== void 0 ? _c : Infinity;
            table = table.interpolateColumnWithTolerance(this.colorColumnSlug, tolerance);
            if (this.manager.matchingEntitiesOnly) {
                table = table.dropRowsWithErrorValuesForColumn(this.colorColumnSlug);
            }
        }
        // We want to "chop off" any rows outside the time domain for X and Y to avoid creating
        // leading and trailing timeline times that don't really exist in the dataset.
        const [timeDomainStart, timeDomainEnd] = table.timeDomainFor([
            this.xColumnSlug,
            this.yColumnSlug,
        ]);
        table = table.filterByTimeRange(timeDomainStart !== null && timeDomainStart !== void 0 ? timeDomainStart : -Infinity, timeDomainEnd !== null && timeDomainEnd !== void 0 ? timeDomainEnd : Infinity);
        if (this.xOverrideTime !== undefined) {
            table = table.interpolateColumnWithTolerance(this.yColumnSlug);
        }
        else {
            table = table.interpolateColumnsByClosestTimeMatch(this.xColumnSlug, this.yColumnSlug);
        }
        // Drop any rows which have non-number values for X or Y.
        // This needs to be done after the tolerance, because the tolerance may fill in some gaps.
        table = table
            .columnFilter(this.xColumnSlug, Util_1.isNumber, "Drop rows with non-number values in X column")
            .columnFilter(this.yColumnSlug, Util_1.isNumber, "Drop rows with non-number values in Y column");
        // The tolerance application might lead to some data being dropped for some years.
        // For example, if X times are [2000, 2005, 2010], and Y times are [2005], then for all 3
        // rows we have the same match [[2005, 2005], [2005, 2005], [2005, 2005]].
        // This means we can drop 2000 and 2010 from the timeline.
        // It might not make a huge difference here, but it makes a difference when there are more
        // entities covering different time periods.
        const [originalTimeDomainStart, originalTimeDomainEnd,] = table.originalTimeDomainFor([this.xColumnSlug, this.yColumnSlug]);
        table = table.filterByTimeRange(originalTimeDomainStart !== null && originalTimeDomainStart !== void 0 ? originalTimeDomainStart : -Infinity, originalTimeDomainEnd !== null && originalTimeDomainEnd !== void 0 ? originalTimeDomainEnd : Infinity);
        return table;
    }
    get inputTable() {
        return this.manager.table;
    }
    get transformedTableFromGrapher() {
        var _a;
        return ((_a = this.manager.transformedTable) !== null && _a !== void 0 ? _a : this.transformTable(this.inputTable));
    }
    // TODO chunk this up into multiple computeds for better performance?
    get transformedTable() {
        let table = this.transformedTableFromGrapher;
        if (this.manager.hideLinesOutsideTolerance &&
            this.manager.startTime !== undefined &&
            this.manager.endTime !== undefined) {
            const entityNames = Array.from(Util_1.intersectionOfSets([this.manager.startTime, this.manager.endTime].map((targetTime) => table.filterByTargetTimes([targetTime], 0)
                .availableEntityNameSet)));
            table = table.filterByEntityNames(entityNames);
        }
        // We don't want to apply this transform when relative mode is also enabled, it has a
        // sligthly different endpoints logic that drops initial zeroes to avoid DivideByZero error.
        if (this.compareEndPointsOnly && !this.manager.isRelativeMode) {
            table = table.keepMinTimeAndMaxTimeForEachEntityOnly();
        }
        if (this.manager.isRelativeMode) {
            table = table.toAverageAnnualChangeForEachEntity([
                this.xColumnSlug,
                this.yColumnSlug,
            ]);
        }
        return table;
    }
    get manager() {
        return this.props.manager;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get canAddCountry() {
        const { addCountryMode } = this.manager;
        return (addCountryMode &&
            addCountryMode !== GrapherConstants_1.EntitySelectionMode.Disabled);
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    onSelectEntity(entityName) {
        if (this.canAddCountry)
            this.selectionArray.toggleSelection(entityName);
    }
    // Returns the colors that are used by all points, *across the whole timeline*.
    // This is why we need the table before the timeline filter is applied.
    get colorsInUse() {
        var _a, _b, _c;
        const allValues = (_c = (_b = (_a = this.manager.tableAfterAuthorTimelineAndActiveChartTransformAndPopulationFilter) === null || _a === void 0 ? void 0 : _a.get(this.colorColumnSlug)) === null || _b === void 0 ? void 0 : _b.valuesIncludingErrorValues) !== null && _c !== void 0 ? _c : [];
        // Need to convert InvalidCell to undefined for color scale to assign correct color
        const colorValues = Util_1.uniq(allValues.map((value) => ErrorValues_1.isNotErrorValue(value) ? value : undefined));
        return Util_1.excludeUndefined(colorValues.map((colorValue) => this.colorScale.getColor(colorValue)));
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    onLegendMouseOver(color) {
        this.hoverColor = color;
    }
    onLegendMouseLeave() {
        this.hoverColor = undefined;
    }
    // When the color legend is clicked, toggle selection fo all associated keys
    onLegendClick() {
        const { hoverColor, selectionArray } = this;
        if (!this.canAddCountry || hoverColor === undefined)
            return;
        const keysToToggle = this.series
            .filter((g) => g.color === hoverColor)
            .map((g) => g.seriesName);
        const allKeysActive = Util_1.intersection(keysToToggle, this.selectedEntityNames).length ===
            keysToToggle.length;
        if (allKeysActive)
            selectionArray.setSelectedEntities(Util_1.without(this.selectedEntityNames, ...keysToToggle));
        else
            selectionArray.setSelectedEntities(Util_1.uniq(this.selectedEntityNames.concat(keysToToggle)));
    }
    // Colors on the legend for which every matching series is focused
    get focusColors() {
        const { colorsInUse } = this;
        return colorsInUse.filter((color) => {
            const matchingKeys = this.series
                .filter((g) => g.color === color)
                .map((g) => g.seriesName);
            return (Util_1.intersection(matchingKeys, this.selectedEntityNames).length ===
                matchingKeys.length);
        });
    }
    // All currently hovered series keys, combining the legend and the main UI
    get hoveredSeriesNames() {
        const { hoverColor, hoveredSeries } = this;
        const hoveredSeriesNames = hoverColor === undefined
            ? []
            : Util_1.uniq(this.series
                .filter((g) => g.color === hoverColor)
                .map((g) => g.seriesName));
        if (hoveredSeries !== undefined)
            hoveredSeriesNames.push(hoveredSeries);
        return hoveredSeriesNames;
    }
    get focusedEntityNames() {
        return this.selectedEntityNames;
    }
    get selectedEntityNames() {
        return this.selectionArray.selectedEntityNames;
    }
    get displayStartTime() {
        var _a;
        return this.transformedTable.timeColumnFormatFunction((_a = this.transformedTable.minTime) !== null && _a !== void 0 ? _a : 1900);
    }
    get displayEndTime() {
        var _a;
        return this.transformedTable.timeColumnFormatFunction((_a = this.transformedTable.maxTime) !== null && _a !== void 0 ? _a : 2000);
    }
    get arrowLegend() {
        if (this.displayStartTime === this.displayEndTime ||
            this.manager.isRelativeMode)
            return undefined;
        return new ConnectedScatterLegend_1.ConnectedScatterLegend(this);
    }
    onScatterMouseOver(series) {
        this.hoveredSeries = series.seriesName;
    }
    onScatterMouseLeave() {
        this.hoveredSeries = undefined;
    }
    onScatterClick() {
        if (this.hoveredSeries)
            this.onSelectEntity(this.hoveredSeries);
    }
    get tooltipSeries() {
        const { hoveredSeries, focusedEntityNames } = this;
        if (hoveredSeries !== undefined)
            return this.series.find((g) => g.seriesName === hoveredSeries);
        if (focusedEntityNames && focusedEntityNames.length === 1)
            return this.series.find((g) => g.seriesName === focusedEntityNames[0]);
        return undefined;
    }
    get legendDimensions() {
        return new VerticalColorLegend_1.VerticalColorLegend({ manager: this });
    }
    get maxLegendWidth() {
        return this.sidebarMaxWidth;
    }
    get sidebarMinWidth() {
        return Math.max(this.bounds.width * 0.1, 60);
    }
    get sidebarMaxWidth() {
        return Math.max(this.bounds.width * 0.2, this.sidebarMinWidth);
    }
    get sidebarWidth() {
        const { legendDimensions, sidebarMinWidth, sidebarMaxWidth } = this;
        return Math.max(Math.min(legendDimensions.width, sidebarMaxWidth), sidebarMinWidth);
    }
    // todo: Refactor
    get dualAxis() {
        const { horizontalAxisPart, verticalAxisPart } = this;
        return new Axis_1.DualAxis({
            bounds: this.bounds.padRight(this.sidebarWidth + 20),
            horizontalAxis: horizontalAxisPart,
            verticalAxis: verticalAxisPart,
        });
    }
    get comparisonLines() {
        return this.manager.comparisonLines;
    }
    onToggleEndpoints() {
        this.manager.compareEndPointsOnly =
            !this.compareEndPointsOnly || undefined;
    }
    // Colors currently on the chart and not greyed out
    get activeColors() {
        const { hoveredSeriesNames, focusedEntityNames } = this;
        const activeKeys = hoveredSeriesNames.concat(focusedEntityNames);
        let series = this.series;
        if (activeKeys.length)
            series = series.filter((g) => activeKeys.includes(g.seriesName));
        const colorValues = Util_1.uniq(Util_1.flatten(series.map((s) => s.points.map((p) => p.color))));
        return Util_1.excludeUndefined(colorValues.map((color) => this.colorScale.getColor(color)));
    }
    get hideConnectedScatterLines() {
        return !!this.manager.hideConnectedScatterLines;
    }
    get points() {
        const { dualAxis, focusedEntityNames, hoveredSeriesNames, hideConnectedScatterLines, manager, series, sizeDomain, colorScale, colorColumn, } = this;
        return (React.createElement(ScatterPointsWithLabels_1.ScatterPointsWithLabels, { noDataModalManager: manager, hideConnectedScatterLines: hideConnectedScatterLines, seriesArray: series, dualAxis: dualAxis, colorScale: !colorColumn.isMissing ? colorScale : undefined, sizeDomain: sizeDomain, focusedSeriesNames: focusedEntityNames, hoveredSeriesNames: hoveredSeriesNames, onMouseOver: this.onScatterMouseOver, onMouseLeave: this.onScatterMouseLeave, onClick: this.onScatterClick }));
    }
    get colorColumnSlug() {
        return this.manager.colorColumnSlug;
    }
    get colorColumn() {
        return this.transformedTable.get(this.colorColumnSlug);
    }
    get legendItems() {
        return this.colorScale.legendBins.filter((bin) => this.colorsInUse.includes(bin.color));
    }
    get title() {
        return this.colorScale.legendDescription;
    }
    componentDidMount() {
        Util_1.exposeInstanceOnWindow(this);
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.bounds, message: this.failMessage }));
        const { bounds, dualAxis, arrowLegend, sidebarWidth, tooltipSeries, comparisonLines, legendDimensions, } = this;
        return (React.createElement("g", { className: "ScatterPlot" },
            React.createElement(AxisViews_1.DualAxisComponent, { dualAxis: dualAxis, showTickMarks: false }),
            comparisonLines &&
                comparisonLines.map((line, i) => (React.createElement(ComparisonLine_1.ComparisonLine, { key: i, dualAxis: dualAxis, comparisonLine: line }))),
            this.points,
            React.createElement(VerticalColorLegend_1.VerticalColorLegend, { manager: this }),
            (arrowLegend || tooltipSeries) && (React.createElement("line", { x1: bounds.right - sidebarWidth, y1: bounds.top + legendDimensions.height + 2, x2: bounds.right - 5, y2: bounds.top + legendDimensions.height + 2, stroke: "#ccc" })),
            arrowLegend && (React.createElement("g", { className: "clickable", onClick: this.onToggleEndpoints }, arrowLegend.render(bounds.right - sidebarWidth, bounds.top + legendDimensions.height + 11))),
            tooltipSeries && (React.createElement(ScatterTooltip_1.ScatterTooltip, { yColumn: this.yColumn, xColumn: this.xColumn, series: tooltipSeries, maxWidth: sidebarWidth, fontSize: this.fontSize, x: bounds.right - sidebarWidth, y: bounds.top +
                    legendDimensions.height +
                    11 +
                    (arrowLegend ? arrowLegend.height + 10 : 0) }))));
    }
    get legendY() {
        return this.bounds.top;
    }
    get legendX() {
        return this.bounds.right - this.sidebarWidth;
    }
    get colorScaleColumn() {
        // We need to use inputTable in order to get consistent coloring for a variable across
        // charts, e.g. each continent being assigned to the same color.
        // inputTable is unfiltered, so it contains every value that exists in the variable.
        return this.inputTable.get(this.colorColumnSlug);
    }
    get colorScaleConfig() {
        var _a;
        return ((_a = ColorScaleConfig_1.ColorScaleConfig.fromDSL(this.colorColumn.def)) !== null && _a !== void 0 ? _a : this.manager.colorScale);
    }
    get hasNoDataBin() {
        if (this.colorColumn.isMissing)
            return false;
        return this.colorColumn.valuesIncludingErrorValues.some((value) => !ErrorValues_1.isNotErrorValue(value));
    }
    get yAxisConfig() {
        var _a;
        return ((_a = this.manager.yAxis) !== null && _a !== void 0 ? _a : new AxisConfig_1.AxisConfig(this.manager.yAxisConfig, this));
    }
    get xAxisConfig() {
        var _a;
        return ((_a = this.manager.xAxis) !== null && _a !== void 0 ? _a : new AxisConfig_1.AxisConfig(this.manager.xAxisConfig, this));
    }
    get yColumnSlug() {
        return ChartUtils_1.autoDetectYColumnSlugs(this.manager)[0];
    }
    get yColumn() {
        return this.transformedTable.get(this.yColumnSlug);
    }
    get xColumnSlug() {
        const { xColumnSlug } = this.manager;
        return xColumnSlug !== null && xColumnSlug !== void 0 ? xColumnSlug : this.manager.table.numericColumnSlugs[1];
    }
    get xColumn() {
        return this.transformedTable.get(this.xColumnSlug);
    }
    get sizeColumnSlug() {
        return this.manager.sizeColumnSlug;
    }
    get sizeColumn() {
        return this.transformedTable.get(this.sizeColumnSlug);
    }
    get failMessage() {
        if (this.yColumn.isMissing)
            return "Missing Y axis variable";
        if (this.yColumn.isMissing)
            return "Missing X axis variable";
        if (Util_1.isEmpty(this.allEntityNamesWithXAndY)) {
            if (this.manager.isRelativeMode &&
                this.manager.hasTimeline &&
                this.manager.startTime === this.manager.endTime) {
                return "Please select a start and end point on the timeline below";
            }
            return "No entities with data for both X and Y";
        }
        if (Util_1.isEmpty(this.series))
            return "No matching data";
        return "";
    }
    // todo: remove this. Should be done as a simple column transform at the data level.
    // Possible to override the x axis dimension to target a special year
    // In case you want to graph say, education in the past and democracy today https://ourworldindata.org/grapher/correlation-between-education-and-democracy
    get xOverrideTime() {
        return this.manager.xOverrideTime;
    }
    // Unlike other charts, the scatterplot shows all available data by default, and the selection
    // is just for emphasis. But this behavior can be disabled.
    get hideBackgroundEntities() {
        return this.manager.addCountryMode === GrapherConstants_1.EntitySelectionMode.Disabled;
    }
    get allEntityNamesWithXAndY() {
        return Util_1.intersection(this.yColumn.uniqEntityNames, this.xColumn.uniqEntityNames);
    }
    // todo: remove. do this at table filter level
    getSeriesNamesToShow(filterBackgroundEntities = this.hideBackgroundEntities) {
        const seriesNames = filterBackgroundEntities
            ? this.selectionArray.selectedEntityNames
            : this.allEntityNamesWithXAndY;
        if (this.manager.matchingEntitiesOnly && !this.colorColumn.isMissing)
            return new Set(Util_1.intersection(seriesNames, this.colorColumn.uniqEntityNames));
        return new Set(seriesNames);
    }
    get compareEndPointsOnly() {
        return !!this.manager.compareEndPointsOnly;
    }
    get allPoints() {
        return Util_1.flatten(this.series.map((series) => series.points));
    }
    // domains across the entire timeline
    domainDefault(property) {
        const scaleType = property === "x" ? this.xScaleType : this.yScaleType;
        if (!this.manager.useTimelineDomains) {
            return Util_1.domainExtent(this.pointsForAxisDomains.map((point) => point[property]), scaleType, this.manager.zoomToSelection && this.selectedPoints.length
                ? 1.1
                : 1);
        }
        if (this.manager.isRelativeMode)
            return Util_1.relativeMinAndMax(this.allPoints, property);
        return Util_1.domainExtent(this.allPoints.map((v) => v[property]), scaleType);
    }
    get xDomainDefault() {
        return this.domainDefault("x");
    }
    get selectedPoints() {
        const seriesNamesSet = this.getSeriesNamesToShow(true);
        return this.allPoints.filter((point) => point.entityName && seriesNamesSet.has(point.entityName));
    }
    get pointsForAxisDomains() {
        if (!this.selectionArray.numSelectedEntities ||
            !this.manager.zoomToSelection)
            return this.allPoints;
        return this.selectedPoints.length ? this.selectedPoints : this.allPoints;
    }
    get sizeDomain() {
        if (this.sizeColumn.isMissing)
            return [1, 100];
        const sizeValues = this.transformedTable
            .get(this.sizeColumn.slug)
            .values.filter(Util_1.isNumber);
        return Util_1.domainExtent(sizeValues, GrapherConstants_1.ScaleType.linear);
    }
    get yScaleType() {
        return this.manager.isRelativeMode
            ? GrapherConstants_1.ScaleType.linear
            : this.yAxisConfig.scaleType || GrapherConstants_1.ScaleType.linear;
    }
    get yDomainDefault() {
        return this.domainDefault("y");
    }
    get verticalAxisPart() {
        var _a;
        const { manager, yDomainDefault } = this;
        const axisConfig = this.yAxisConfig;
        const axis = axisConfig.toVerticalAxis();
        axis.formatColumn = this.yColumn;
        const label = axisConfig.label || ((_a = this.yColumn) === null || _a === void 0 ? void 0 : _a.displayName) || "";
        axis.scaleType = this.yScaleType;
        if (manager.isRelativeMode) {
            axis.domain = yDomainDefault; // Overwrite user's min/max
            if (label && label.length > 1) {
                axis.label = `Average annual change in ${Util_1.lowerCaseFirstLetterUnlessAbbreviation(label)}`;
            }
        }
        else {
            axis.updateDomainPreservingUserSettings(yDomainDefault);
            axis.label = label;
        }
        return axis;
    }
    get xScaleType() {
        var _a;
        return this.manager.isRelativeMode
            ? GrapherConstants_1.ScaleType.linear
            : (_a = this.xAxisConfig.scaleType) !== null && _a !== void 0 ? _a : GrapherConstants_1.ScaleType.linear;
    }
    get xAxisLabelBase() {
        var _a;
        const xDimName = (_a = this.xColumn) === null || _a === void 0 ? void 0 : _a.displayName;
        if (this.xOverrideTime !== undefined)
            return `${xDimName} in ${this.xOverrideTime}`;
        return xDimName;
    }
    get horizontalAxisPart() {
        const { xDomainDefault, manager, xAxisLabelBase } = this;
        const { xAxisConfig } = this;
        const axis = xAxisConfig.toHorizontalAxis();
        axis.formatColumn = this.xColumn;
        axis.scaleType = this.xScaleType;
        if (manager.isRelativeMode) {
            axis.domain = xDomainDefault; // Overwrite user's min/max
            const label = xAxisConfig.label || xAxisLabelBase;
            if (label && label.length > 1) {
                axis.label = `Average annual change in ${Util_1.lowerCaseFirstLetterUnlessAbbreviation(label)}`;
            }
        }
        else {
            axis.updateDomainPreservingUserSettings(xDomainDefault);
            const label = xAxisConfig.label || xAxisLabelBase;
            if (label)
                axis.label = label;
        }
        return axis;
    }
    getPointLabel(row) {
        var _a, _b;
        const strat = this.manager.scatterPointLabelStrategy;
        let label;
        if (strat === GrapherConstants_1.ScatterPointLabelStrategy.y) {
            label = (_a = this.yColumn) === null || _a === void 0 ? void 0 : _a.formatValue(row[this.yColumnSlug]);
        }
        else if (strat === GrapherConstants_1.ScatterPointLabelStrategy.x) {
            label = (_b = this.xColumn) === null || _b === void 0 ? void 0 : _b.formatValue(row[this.xColumnSlug]);
        }
        else {
            label = this.transformedTable.timeColumnFormatFunction(row[this.transformedTable.timeColumn.slug]);
        }
        return label;
    }
    removePointsOutsidePlane(points) {
        const { yAxisConfig, xAxisConfig } = this;
        if (yAxisConfig.removePointsOutsideDomain ||
            xAxisConfig.removePointsOutsideDomain) {
            return points.filter((point) => {
                return (!xAxisConfig.shouldRemovePoint(point.x) &&
                    !yAxisConfig.shouldRemovePoint(point.y));
            });
        }
        return points;
    }
    get allPointsBeforeEndpointsFilter() {
        const { entityNameSlug, timeColumn } = this.transformedTable;
        // We are running this filter first because it only depends on author-specified config, not
        // on any user interaction.
        return this.removePointsOutsidePlane(this.transformedTable.rows.map((row) => {
            var _a;
            return {
                x: row[this.xColumnSlug],
                y: row[this.yColumnSlug],
                size: ErrorValues_1.defaultIfErrorValue(row[this.sizeColumn.slug], 0),
                color: ErrorValues_1.defaultIfErrorValue(row[this.colorColumn.slug], undefined),
                entityName: row[entityNameSlug],
                label: (_a = this.getPointLabel(row)) !== null && _a !== void 0 ? _a : "",
                timeValue: row[timeColumn.slug],
                time: {
                    x: row[this.xColumn.originalTimeColumnSlug],
                    y: row[this.yColumn.originalTimeColumnSlug],
                },
            };
        }));
    }
    get series() {
        return Object.entries(Util_1.groupBy(this.allPointsBeforeEndpointsFilter, (p) => p.entityName)).map(([entityName, points]) => {
            const series = {
                seriesName: entityName,
                label: entityName,
                color: "#932834",
                size: this.getSizeFromPoints(points),
                points,
            };
            this.assignColorToSeries(entityName, series);
            return series;
        });
    }
    assignColorToSeries(entityName, series) {
        if (series.points.length) {
            const keyColor = this.transformedTable.getColorForEntityName(entityName);
            if (keyColor !== undefined)
                series.color = keyColor;
            else if (!this.colorColumn.isMissing) {
                const colorValue = Util_1.last(series.points.map((point) => point.color));
                const color = this.colorScale.getColor(colorValue);
                if (color !== undefined) {
                    series.color = color;
                    series.isScaleColor = true;
                }
            }
        }
    }
    getSizeFromPoints(points) {
        const size = Util_1.last(points.map((v) => v.size).filter(Util_1.isNumber));
        return size !== null && size !== void 0 ? size : 0;
    }
};
__decorate([
    mobx_1.observable
], ScatterPlotChart.prototype, "hoveredSeries", void 0);
__decorate([
    mobx_1.observable
], ScatterPlotChart.prototype, "hoverColor", void 0);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "transformedTableFromGrapher", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "manager", null);
__decorate([
    mobx_1.computed.struct
], ScatterPlotChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "canAddCountry", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onSelectEntity", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "colorsInUse", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "fontSize", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onLegendClick", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "focusColors", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "hoveredSeriesNames", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "focusedEntityNames", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "selectedEntityNames", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "displayStartTime", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "displayEndTime", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "arrowLegend", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onScatterMouseOver", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onScatterMouseLeave", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onScatterClick", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "tooltipSeries", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "legendDimensions", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "maxLegendWidth", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "sidebarMinWidth", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "sidebarMaxWidth", null);
__decorate([
    mobx_1.computed.struct
], ScatterPlotChart.prototype, "sidebarWidth", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "dualAxis", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "comparisonLines", null);
__decorate([
    mobx_1.action.bound
], ScatterPlotChart.prototype, "onToggleEndpoints", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "activeColors", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "hideConnectedScatterLines", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "points", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "colorColumnSlug", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "colorColumn", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "legendItems", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "title", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "legendY", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "colorScaleColumn", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "colorScaleConfig", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "hasNoDataBin", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "yAxisConfig", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xAxisConfig", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "yColumnSlug", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "yColumn", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xColumnSlug", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xColumn", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "sizeColumnSlug", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "sizeColumn", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xOverrideTime", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "hideBackgroundEntities", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "allEntityNamesWithXAndY", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "compareEndPointsOnly", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "allPoints", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xDomainDefault", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "selectedPoints", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "pointsForAxisDomains", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "sizeDomain", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "yScaleType", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "yDomainDefault", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "verticalAxisPart", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xScaleType", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "xAxisLabelBase", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "horizontalAxisPart", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "allPointsBeforeEndpointsFilter", null);
__decorate([
    mobx_1.computed
], ScatterPlotChart.prototype, "series", null);
ScatterPlotChart = __decorate([
    mobx_react_1.observer
], ScatterPlotChart);
exports.ScatterPlotChart = ScatterPlotChart;
//# sourceMappingURL=ScatterPlotChart.js.map