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
exports.MapChart = void 0;
const React = __importStar(require("react"));
const Bounds_1 = require("../../clientUtils/Bounds");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const HorizontalColorLegends_1 = require("../horizontalColorLegend/HorizontalColorLegends");
const Util_1 = require("../../clientUtils/Util");
const isPresent_1 = require("../../clientUtils/isPresent");
const MapProjections_1 = require("./MapProjections");
const d3_selection_1 = require("d3-selection");
const d3_ease_1 = require("d3-ease");
const MapTooltip_1 = require("./MapTooltip");
const ProjectionChooser_1 = require("./ProjectionChooser");
const EntitiesOnTheMap_1 = require("./EntitiesOnTheMap");
const MapConfig_1 = require("./MapConfig");
const ColorScale_1 = require("../color/ColorScale");
const GrapherConstants_1 = require("../core/GrapherConstants");
const ColorScaleBin_1 = require("../color/ColorScaleBin");
const topojson = __importStar(require("topojson-client"));
const MapTopology_1 = require("./MapTopology");
const PointVector_1 = require("../../clientUtils/PointVector");
const WorldRegionsToProjection_1 = require("./WorldRegionsToProjection");
const ColorConstants_1 = require("../color/ColorConstants");
const ChartUtils_1 = require("../chart/ChartUtils");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const ColorScaleConfig_1 = require("../color/ColorScaleConfig");
const PROJECTION_CHOOSER_WIDTH = 110;
const PROJECTION_CHOOSER_HEIGHT = 22;
const DEFAULT_STROKE_COLOR = "#333";
// Get the underlying geographical topology elements we're going to display
const GeoFeatures = topojson.feature(MapTopology_1.MapTopology, MapTopology_1.MapTopology.objects.world).features;
// Get the svg path specification string for every feature
const geoPathCache = new Map();
const geoPathsFor = (projectionName) => {
    if (geoPathCache.has(projectionName))
        return geoPathCache.get(projectionName);
    const projectionGeo = MapProjections_1.MapProjectionGeos[projectionName];
    const strs = GeoFeatures.map((feature) => {
        const s = projectionGeo(feature);
        const paths = s.split(/Z/).filter(Util_1.identity);
        const newPaths = paths.map((path) => {
            const points = path.split(/[MLZ]/).filter((f) => f);
            const rounded = points.map((point) => point
                .split(/,/)
                .map((v) => parseFloat(v).toFixed(1))
                .join(","));
            return "M" + rounded.join("L");
        });
        return newPaths.join("Z") + "Z";
    });
    geoPathCache.set(projectionName, strs);
    return geoPathCache.get(projectionName);
};
// Get the bounding box for every geographical feature
const geoBoundsCache = new Map();
const geoBoundsFor = (projectionName) => {
    if (geoBoundsCache.has(projectionName))
        return geoBoundsCache.get(projectionName);
    const projectionGeo = MapProjections_1.MapProjectionGeos[projectionName];
    const bounds = GeoFeatures.map((feature) => {
        const corners = projectionGeo.bounds(feature);
        const bounds = Bounds_1.Bounds.fromCorners(new PointVector_1.PointVector(...corners[0]), new PointVector_1.PointVector(...corners[1]));
        // HACK (Mispy): The path generator calculates weird bounds for Fiji (probably it wraps around the map)
        if (feature.id === "Fiji")
            return bounds.extend({
                x: bounds.right - bounds.height,
                width: bounds.height,
            });
        return bounds;
    });
    geoBoundsCache.set(projectionName, bounds);
    return geoBoundsCache.get(projectionName);
};
// Bundle GeoFeatures with the calculated info needed to render them
const renderFeaturesCache = new Map();
const renderFeaturesFor = (projectionName) => {
    if (renderFeaturesCache.has(projectionName))
        return renderFeaturesCache.get(projectionName);
    const geoBounds = geoBoundsFor(projectionName);
    const geoPaths = geoPathsFor(projectionName);
    const feats = GeoFeatures.map((geo, index) => ({
        id: geo.id,
        geo: geo,
        path: geoPaths[index],
        bounds: geoBounds[index],
        center: geoBounds[index].centerPos,
    }));
    renderFeaturesCache.set(projectionName, feats);
    return renderFeaturesCache.get(projectionName);
};
let MapChart = class MapChart extends React.Component {
    constructor() {
        super(...arguments);
        this.tooltip = null;
        this.base = React.createRef();
        this.colorScale = new ColorScale_1.ColorScale(this);
        this.defaultBaseColorScheme = ColorConstants_1.ColorSchemeName.BuGn;
        this.hasNoDataBin = true;
    }
    transformTable(table) {
        if (!table.has(this.mapColumnSlug))
            return table;
        return this.dropNonMapEntities(table)
            .dropRowsWithErrorValuesForColumn(this.mapColumnSlug)
            .interpolateColumnWithTolerance(this.mapColumnSlug, this.mapConfig.timeTolerance);
    }
    dropNonMapEntities(table) {
        const entityNamesToSelect = table.availableEntityNames.filter(EntitiesOnTheMap_1.isOnTheMap);
        return table.filterByEntityNames(entityNamesToSelect);
    }
    get inputTable() {
        return this.manager.table;
    }
    get transformedTable() {
        var _a;
        return ((_a = this.manager.transformedTable) !== null && _a !== void 0 ? _a : this.transformTable(this.inputTable));
    }
    get failMessage() {
        if (this.mapColumn.isMissing)
            return "Missing map column";
        return "";
    }
    get mapColumn() {
        return this.transformedTable.get(this.mapColumnSlug);
    }
    get mapColumnSlug() {
        var _a;
        return ((_a = this.manager.mapColumnSlug) !== null && _a !== void 0 ? _a : ChartUtils_1.autoDetectYColumnSlugs(this.manager)[0]);
    }
    get targetTime() {
        return this.manager.endTime;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    onMapMouseOver(feature, ev) {
        const series = feature.id === undefined
            ? undefined
            : this.seriesMap.get(feature.id);
        this.focusEntity = {
            id: feature.id,
            series: series || { value: "No data" },
        };
        const { containerElement } = this.props;
        if (!containerElement)
            return;
        const mouse = Util_1.getRelativeMouse(containerElement, ev);
        if (feature.id !== undefined)
            this.tooltipTarget = {
                x: mouse.x,
                y: mouse.y,
                featureId: feature.id,
            };
    }
    onMapMouseLeave() {
        this.focusEntity = undefined;
        this.tooltipTarget = undefined;
    }
    get manager() {
        return this.props.manager;
    }
    get entityNamesWithData() {
        // We intentionally use `inputTable` here instead of `transformedTable`, because of countries where there is no data
        // available in the map view for the current year, but data might still be available for other chart types
        return this.inputTable.entitiesWith([this.mapColumnSlug]);
    }
    // Determine if we can go to line chart by clicking on a given map entity
    isEntityClickable(entityName) {
        if (!this.manager.mapIsClickable || !entityName)
            return false;
        return this.entityNamesWithData.has(entityName);
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    onClick(d, ev) {
        const entityName = d.id;
        if (!this.isEntityClickable(entityName))
            return;
        if (!ev.shiftKey) {
            this.selectionArray.setSelectedEntities([entityName]);
            this.manager.currentTab = GrapherConstants_1.GrapherTabOption.chart;
        }
        else
            this.selectionArray.toggleSelection(entityName);
    }
    componentWillUnmount() {
        this.onMapMouseLeave();
        this.onLegendMouseLeave();
    }
    onLegendMouseOver(bracket) {
        this.focusBracket = bracket;
    }
    onLegendMouseLeave() {
        this.focusBracket = undefined;
    }
    get mapConfig() {
        return this.manager.mapConfig || new MapConfig_1.MapConfig();
    }
    onProjectionChange(value) {
        this.mapConfig.projection = value;
    }
    get formatTooltipValue() {
        const { mapConfig, mapColumn, colorScale } = this;
        const customLabels = mapConfig.tooltipUseCustomLabels
            ? colorScale.customNumericLabels
            : [];
        return (d) => {
            var _a, _b;
            if (Util_1.isString(d))
                return d;
            else
                return (_b = (_a = customLabels[d]) !== null && _a !== void 0 ? _a : mapColumn === null || mapColumn === void 0 ? void 0 : mapColumn.formatValueLong(d)) !== null && _b !== void 0 ? _b : "";
        };
    }
    get series() {
        const { mapColumn, selectionArray, targetTime, formatTooltipValue, } = this;
        if (mapColumn.isMissing)
            return [];
        if (targetTime === undefined)
            return [];
        return mapColumn.owidRows
            .map((row) => {
            const { entityName, value, time } = row;
            const color = this.colorScale.getColor(value) || "red"; // todo: color fix
            if (!color)
                return undefined;
            return {
                seriesName: entityName,
                displayValue: formatTooltipValue(value),
                time,
                value,
                isSelected: selectionArray.selectedSet.has(entityName),
                color,
                highlightFillColor: color,
            };
        })
            .filter(isPresent_1.isPresent);
    }
    get seriesMap() {
        const map = new Map();
        this.series.forEach((series) => {
            map.set(series.seriesName, series);
        });
        return map;
    }
    get colorScaleColumn() {
        // Use the table before transform to build the legend.
        // Otherwise the legend jumps around as you slide the timeline handle.
        return this.dropNonMapEntities(this.inputTable).get(this.mapColumnSlug);
    }
    get colorScaleConfig() {
        var _a;
        return ((_a = ColorScaleConfig_1.ColorScaleConfig.fromDSL(this.mapColumn.def)) !== null && _a !== void 0 ? _a : this.mapConfig.colorScale);
    }
    componentDidMount() {
        d3_selection_1.select(this.base.current)
            .selectAll("path")
            .attr("data-fill", function () {
            return this.getAttribute("fill");
        })
            .attr("fill", this.colorScale.noDataColor)
            .transition()
            .duration(500)
            .ease(d3_ease_1.easeCubic)
            .attr("fill", function () {
            return this.getAttribute("data-fill");
        })
            .attr("data-fill", function () {
            return this.getAttribute("fill");
        });
        Util_1.exposeInstanceOnWindow(this);
    }
    get projectionChooserBounds() {
        const { bounds } = this;
        return new Bounds_1.Bounds(bounds.width - PROJECTION_CHOOSER_WIDTH + 15 - 3, 5, PROJECTION_CHOOSER_WIDTH, PROJECTION_CHOOSER_HEIGHT);
    }
    get legendData() {
        return this.colorScale.legendBins;
    }
    get equalSizeBins() {
        return this.colorScale.config.equalSizeBins;
    }
    get focusValue() {
        var _a, _b;
        return (_b = (_a = this.focusEntity) === null || _a === void 0 ? void 0 : _a.series) === null || _b === void 0 ? void 0 : _b.value;
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get numericLegendData() {
        if (this.hasCategorical ||
            !this.legendData.some((bin) => bin.value === "No data" && !bin.isHidden))
            return this.legendData.filter((bin) => bin instanceof ColorScaleBin_1.NumericBin && !bin.isHidden);
        const bin = this.legendData.filter((bin) => (bin instanceof ColorScaleBin_1.NumericBin || bin.value === "No data") &&
            !bin.isHidden);
        return Util_1.flatten([bin[bin.length - 1], bin.slice(0, -1)]);
    }
    get hasNumeric() {
        return this.numericLegendData.length > 1;
    }
    get categoricalLegendData() {
        return this.legendData.filter((bin) => bin instanceof ColorScaleBin_1.CategoricalBin && !bin.isHidden);
    }
    get hasCategorical() {
        return this.categoricalLegendData.length > 1;
    }
    get numericFocusBracket() {
        const { focusBracket, focusValue } = this;
        const { numericLegendData } = this;
        if (focusBracket)
            return focusBracket;
        if (focusValue)
            return numericLegendData.find((bin) => bin.contains(focusValue));
        return undefined;
    }
    get categoricalFocusBracket() {
        const { focusBracket, focusValue } = this;
        const { categoricalLegendData } = this;
        if (focusBracket && focusBracket instanceof ColorScaleBin_1.CategoricalBin)
            return focusBracket;
        if (focusValue)
            return categoricalLegendData.find((bin) => bin.contains(focusValue));
        return undefined;
    }
    get categoricalBinStroke() {
        return DEFAULT_STROKE_COLOR;
    }
    get legendBounds() {
        return this.bounds.padBottom(15);
    }
    get legendWidth() {
        return this.legendBounds.width * 0.8;
    }
    get legendHeight() {
        return this.categoryLegendHeight + this.numericLegendHeight + 10;
    }
    get numericLegendHeight() {
        return this.numericLegend ? this.numericLegend.height : 0;
    }
    get categoryLegendHeight() {
        return this.categoryLegend ? this.categoryLegend.height + 5 : 0;
    }
    get categoryLegend() {
        return this.categoricalLegendData.length > 1
            ? new HorizontalColorLegends_1.HorizontalCategoricalColorLegend({ manager: this })
            : undefined;
    }
    get numericLegend() {
        return this.numericLegendData.length > 1
            ? new HorizontalColorLegends_1.HorizontalNumericColorLegend({ manager: this })
            : undefined;
    }
    get legendX() {
        const { bounds, numericLegend, categoryLegend } = this;
        if (numericLegend)
            return bounds.centerX - this.legendWidth / 2;
        if (categoryLegend)
            return bounds.centerX - categoryLegend.width / 2;
        return 0;
    }
    get categoryLegendY() {
        const { categoryLegend, bounds, categoryLegendHeight } = this;
        if (categoryLegend)
            return bounds.bottom - categoryLegendHeight;
        return 0;
    }
    get numericLegendY() {
        const { numericLegend, numericLegendHeight, bounds, categoryLegendHeight, } = this;
        if (numericLegend)
            return (bounds.bottom - categoryLegendHeight - numericLegendHeight - 4);
        return 0;
    }
    renderMapLegend() {
        const { numericLegend, categoryLegend } = this;
        return (React.createElement("g", null,
            numericLegend && (React.createElement(HorizontalColorLegends_1.HorizontalNumericColorLegend, { manager: this })),
            categoryLegend && (React.createElement(HorizontalColorLegends_1.HorizontalCategoricalColorLegend, { manager: this }))));
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.props.bounds, message: this.failMessage }));
        const { focusBracket, focusEntity, tooltipTarget, projectionChooserBounds, seriesMap, colorScale, mapConfig, } = this;
        const { projection } = mapConfig;
        const tooltipDatum = tooltipTarget
            ? seriesMap.get(tooltipTarget.featureId)
            : undefined;
        return (React.createElement("g", { ref: this.base, className: "mapTab" },
            React.createElement(ChoroplethMap, { bounds: this.bounds.padBottom(this.legendHeight + 15), choroplethData: seriesMap, projection: projection, defaultFill: colorScale.noDataColor, onHover: this.onMapMouseOver, onHoverStop: this.onMapMouseLeave, onClick: this.onClick, focusBracket: focusBracket, focusEntity: focusEntity }),
            this.renderMapLegend(),
            React.createElement("foreignObject", { id: "projection-chooser", x: projectionChooserBounds.left, y: projectionChooserBounds.top, width: projectionChooserBounds.width, height: projectionChooserBounds.height, style: {
                    overflow: "visible",
                    height: "100%",
                    pointerEvents: "none",
                } },
                React.createElement(ProjectionChooser_1.ProjectionChooser, { value: projection, onChange: this.onProjectionChange })),
            tooltipTarget && (React.createElement(MapTooltip_1.MapTooltip, { tooltipDatum: tooltipDatum, isEntityClickable: this.isEntityClickable(tooltipTarget === null || tooltipTarget === void 0 ? void 0 : tooltipTarget.featureId), tooltipTarget: tooltipTarget, manager: this.manager, colorScale: this.colorScale, targetTime: this.targetTime }))));
    }
};
__decorate([
    mobx_1.observable.ref
], MapChart.prototype, "tooltip", void 0);
__decorate([
    mobx_1.observable
], MapChart.prototype, "tooltipTarget", void 0);
__decorate([
    mobx_1.observable
], MapChart.prototype, "focusEntity", void 0);
__decorate([
    mobx_1.observable
], MapChart.prototype, "focusBracket", void 0);
__decorate([
    mobx_1.computed
], MapChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "mapColumn", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "mapColumnSlug", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "targetTime", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "bounds", null);
__decorate([
    mobx_1.action.bound
], MapChart.prototype, "onMapMouseOver", null);
__decorate([
    mobx_1.action.bound
], MapChart.prototype, "onMapMouseLeave", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "entityNamesWithData", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.action.bound
], MapChart.prototype, "onClick", null);
__decorate([
    mobx_1.action.bound
], MapChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], MapChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "mapConfig", null);
__decorate([
    mobx_1.action.bound
], MapChart.prototype, "onProjectionChange", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "formatTooltipValue", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "series", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "seriesMap", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "colorScaleColumn", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "colorScaleConfig", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "projectionChooserBounds", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "legendData", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "equalSizeBins", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "focusValue", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "numericLegendData", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "hasNumeric", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "categoricalLegendData", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "hasCategorical", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "numericFocusBracket", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "categoricalFocusBracket", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "categoricalBinStroke", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "legendBounds", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "legendWidth", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "legendHeight", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "numericLegendHeight", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "categoryLegendHeight", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "categoryLegend", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "numericLegend", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "categoryLegendY", null);
__decorate([
    mobx_1.computed
], MapChart.prototype, "numericLegendY", null);
MapChart = __decorate([
    mobx_react_1.observer
], MapChart);
exports.MapChart = MapChart;
let ChoroplethMap = class ChoroplethMap extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        // If true selected countries will have an outline
        this.showSelectedStyle = false;
    }
    get uid() {
        return Util_1.guid();
    }
    get bounds() {
        return this.props.bounds;
    }
    get choroplethData() {
        return this.props.choroplethData;
    }
    get defaultFill() {
        return this.props.defaultFill;
    }
    // Combine bounding boxes to get the extents of the entire map
    get mapBounds() {
        return Bounds_1.Bounds.merge(geoBoundsFor(this.props.projection));
    }
    get focusBracket() {
        return this.props.focusBracket;
    }
    get focusEntity() {
        return this.props.focusEntity;
    }
    // Check if a geo entity is currently focused, either directly or via the bracket
    hasFocus(id) {
        const { choroplethData, focusBracket, focusEntity } = this;
        if (focusEntity && focusEntity.id === id)
            return true;
        else if (!focusBracket)
            return false;
        const datum = choroplethData.get(id) || null;
        if (focusBracket.contains(datum === null || datum === void 0 ? void 0 : datum.value))
            return true;
        else
            return false;
    }
    isSelected(id) {
        return this.choroplethData.get(id).isSelected;
    }
    // Viewport for each projection, defined by center and width+height in fractional coordinates
    get viewport() {
        const viewports = {
            World: { x: 0.565, y: 0.5, width: 1, height: 1 },
            Europe: { x: 0.5, y: 0.22, width: 0.2, height: 0.2 },
            Africa: { x: 0.49, y: 0.7, width: 0.21, height: 0.38 },
            NorthAmerica: { x: 0.49, y: 0.4, width: 0.19, height: 0.32 },
            SouthAmerica: { x: 0.52, y: 0.815, width: 0.1, height: 0.26 },
            Asia: { x: 0.75, y: 0.45, width: 0.3, height: 0.5 },
            Oceania: { x: 0.51, y: 0.75, width: 0.1, height: 0.2 },
        };
        return viewports[this.props.projection];
    }
    // Calculate what scaling should be applied to the untransformed map to match the current viewport to the container
    get viewportScale() {
        const { bounds, viewport, mapBounds } = this;
        const viewportWidth = viewport.width * mapBounds.width;
        const viewportHeight = viewport.height * mapBounds.height;
        return Math.min(bounds.width / viewportWidth, bounds.height / viewportHeight);
    }
    get matrixTransform() {
        const { bounds, mapBounds, viewport, viewportScale } = this;
        // Calculate our reference dimensions. These values are independent of the current
        // map translation and scaling.
        const mapX = mapBounds.x + 1;
        const mapY = mapBounds.y + 1;
        // Work out how to center the map, accounting for the new scaling we've worked out
        const newWidth = mapBounds.width * viewportScale;
        const newHeight = mapBounds.height * viewportScale;
        const boundsCenterX = bounds.left + bounds.width / 2;
        const boundsCenterY = bounds.top + bounds.height / 2;
        const newCenterX = mapX + (viewportScale - 1) * mapBounds.x + viewport.x * newWidth;
        const newCenterY = mapY + (viewportScale - 1) * mapBounds.y + viewport.y * newHeight;
        const newOffsetX = boundsCenterX - newCenterX;
        const newOffsetY = boundsCenterY - newCenterY;
        const matrixStr = `matrix(${viewportScale},0,0,${viewportScale},${newOffsetX},${newOffsetY})`;
        return matrixStr;
    }
    // Features that aren't part of the current projection (e.g. India if we're showing Africa)
    get featuresOutsideProjection() {
        return Util_1.difference(renderFeaturesFor(this.props.projection), this.featuresInProjection);
    }
    get featuresInProjection() {
        const { projection } = this.props;
        const features = renderFeaturesFor(this.props.projection);
        if (projection === MapProjections_1.MapProjectionName.World)
            return features;
        return features.filter((feature) => projection ===
            WorldRegionsToProjection_1.WorldRegionToProjection[feature.id]);
    }
    get featuresWithNoData() {
        return Util_1.difference(this.featuresInProjection, this.featuresWithData);
    }
    get featuresWithData() {
        return this.featuresInProjection.filter((feature) => this.choroplethData.has(feature.id));
    }
    onMouseMove(ev) {
        if (ev.shiftKey)
            this.showSelectedStyle = true; // Turn on highlight selection. To turn off, user can switch tabs.
        if (this.hoverEnterFeature)
            return;
        const { featuresInProjection } = this;
        const mouse = Util_1.getRelativeMouse(this.base.current.querySelector(".subunits"), ev);
        const featuresWithDistance = featuresInProjection.map((feature) => {
            return {
                feature,
                distance: PointVector_1.PointVector.distance(feature.center, mouse),
            };
        });
        const feature = Util_1.minBy(featuresWithDistance, (d) => d.distance);
        if (feature && feature.distance < 20) {
            if (feature.feature !== this.hoverNearbyFeature) {
                this.hoverNearbyFeature = feature.feature;
                this.props.onHover(feature.feature.geo, ev);
            }
        }
        else {
            this.hoverNearbyFeature = undefined;
            this.props.onHoverStop();
        }
    }
    onMouseEnter(feature, ev) {
        this.hoverEnterFeature = feature;
        this.props.onHover(feature.geo, ev);
    }
    onMouseLeave() {
        this.hoverEnterFeature = undefined;
        this.props.onHoverStop();
    }
    get hoverFeature() {
        return this.hoverEnterFeature || this.hoverNearbyFeature;
    }
    onClick(ev) {
        if (this.hoverFeature !== undefined)
            this.props.onClick(this.hoverFeature.geo, ev);
    }
    // SVG layering is based on order of appearance in the element tree (later elements rendered on top)
    // The ordering here is quite careful
    render() {
        const { uid, bounds, choroplethData, defaultFill, matrixTransform, viewportScale, featuresOutsideProjection, featuresWithNoData, featuresWithData, } = this;
        const focusStrokeColor = "#111";
        const focusStrokeWidth = 1.5;
        const selectedStrokeWidth = 1;
        const blurFillOpacity = 0.2;
        const blurStrokeOpacity = 0.5;
        const clipPath = ChartUtils_1.makeClipPath(uid, bounds);
        return (React.createElement("g", { ref: this.base, className: "ChoroplethMap", clipPath: clipPath.id, onMouseDown: (ev) => ev.preventDefault() /* Without this, title may get selected while shift clicking */, onMouseMove: this.onMouseMove, onMouseLeave: this.onMouseLeave, style: this.hoverFeature ? { cursor: "pointer" } : {} },
            React.createElement("rect", { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, fill: "rgba(255,255,255,0)", opacity: 0 }),
            clipPath.element,
            React.createElement("g", { className: "subunits", transform: matrixTransform },
                featuresOutsideProjection.length && (React.createElement("g", { className: "nonProjectionFeatures" }, featuresOutsideProjection.map((feature) => {
                    return (React.createElement("path", { key: feature.id, d: feature.path, strokeWidth: 0.3 / viewportScale, stroke: "#aaa", fill: "#fff" }));
                }))),
                featuresWithNoData.length && (React.createElement("g", { className: "noDataFeatures" }, featuresWithNoData.map((feature) => {
                    const isFocus = this.hasFocus(feature.id);
                    const outOfFocusBracket = !!this.focusBracket && !isFocus;
                    const stroke = isFocus
                        ? focusStrokeColor
                        : "#aaa";
                    const fillOpacity = outOfFocusBracket
                        ? blurFillOpacity
                        : 1;
                    const strokeOpacity = outOfFocusBracket
                        ? blurStrokeOpacity
                        : 1;
                    return (React.createElement("path", { key: feature.id, d: feature.path, strokeWidth: (isFocus ? focusStrokeWidth : 0.3) /
                            viewportScale, stroke: stroke, strokeOpacity: strokeOpacity, cursor: "pointer", fill: defaultFill, fillOpacity: fillOpacity, onClick: (ev) => this.props.onClick(feature.geo, ev), onMouseEnter: (ev) => this.onMouseEnter(feature, ev), onMouseLeave: this.onMouseLeave }));
                }))),
                Util_1.sortBy(featuresWithData.map((feature) => {
                    const isFocus = this.hasFocus(feature.id);
                    const showSelectedStyle = this.showSelectedStyle &&
                        this.isSelected(feature.id);
                    const outOfFocusBracket = !!this.focusBracket && !isFocus;
                    const series = choroplethData.get(feature.id);
                    const stroke = isFocus || showSelectedStyle
                        ? focusStrokeColor
                        : DEFAULT_STROKE_COLOR;
                    const fill = series ? series.color : defaultFill;
                    const fillOpacity = outOfFocusBracket
                        ? blurFillOpacity
                        : 1;
                    const strokeOpacity = outOfFocusBracket
                        ? blurStrokeOpacity
                        : 1;
                    return (React.createElement("path", { key: feature.id, d: feature.path, strokeWidth: (isFocus
                            ? focusStrokeWidth
                            : showSelectedStyle
                                ? selectedStrokeWidth
                                : 0.3) / viewportScale, stroke: stroke, strokeOpacity: strokeOpacity, cursor: "pointer", fill: fill, fillOpacity: fillOpacity, onClick: (ev) => this.props.onClick(feature.geo, ev), onMouseEnter: (ev) => this.onMouseEnter(feature, ev), onMouseLeave: this.onMouseLeave }));
                }), (p) => p.props["strokeWidth"]))));
    }
};
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "uid", null);
__decorate([
    mobx_1.computed.struct
], ChoroplethMap.prototype, "bounds", null);
__decorate([
    mobx_1.computed.struct
], ChoroplethMap.prototype, "choroplethData", null);
__decorate([
    mobx_1.computed.struct
], ChoroplethMap.prototype, "defaultFill", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "mapBounds", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "focusBracket", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "focusEntity", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "viewport", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "viewportScale", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "matrixTransform", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "featuresOutsideProjection", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "featuresInProjection", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "featuresWithNoData", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "featuresWithData", null);
__decorate([
    mobx_1.observable
], ChoroplethMap.prototype, "hoverEnterFeature", void 0);
__decorate([
    mobx_1.observable
], ChoroplethMap.prototype, "hoverNearbyFeature", void 0);
__decorate([
    mobx_1.action.bound
], ChoroplethMap.prototype, "onMouseMove", null);
__decorate([
    mobx_1.action.bound
], ChoroplethMap.prototype, "onMouseEnter", null);
__decorate([
    mobx_1.action.bound
], ChoroplethMap.prototype, "onMouseLeave", null);
__decorate([
    mobx_1.computed
], ChoroplethMap.prototype, "hoverFeature", null);
__decorate([
    mobx_1.action.bound
], ChoroplethMap.prototype, "onClick", null);
__decorate([
    mobx_1.observable
], ChoroplethMap.prototype, "showSelectedStyle", void 0);
ChoroplethMap = __decorate([
    mobx_react_1.observer
], ChoroplethMap);
//# sourceMappingURL=MapChart.js.map