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
exports.MapTooltip = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Tooltip_1 = require("../tooltip/Tooltip");
const Util_1 = require("../../clientUtils/Util");
const SparkBars_1 = require("../sparkBars/SparkBars");
const SparkBarTimeSeriesValue_1 = require("../sparkBars/SparkBarTimeSeriesValue");
const ColorScale_1 = require("../color/ColorScale");
const GrapherConstants_1 = require("../core/GrapherConstants");
let MapTooltip = class MapTooltip extends React.Component {
    constructor() {
        var _a;
        super(...arguments);
        this.sparkBarsDatumXAccessor = (d) => d.time;
        this.colorScale = (_a = this.props.colorScale) !== null && _a !== void 0 ? _a : new ColorScale_1.ColorScale();
    }
    get sparkBarsToDisplay() {
        return Util_1.isMobile() ? 13 : 20;
    }
    get sparkBarsProps() {
        return {
            data: this.sparkBarsData,
            x: this.sparkBarsDatumXAccessor,
            y: (d) => d.value,
            xDomain: this.sparkBarsDomain,
        };
    }
    get inputTable() {
        return this.props.manager.table;
    }
    get mapColumnSlug() {
        return this.props.manager.mapColumnSlug;
    }
    // Uses the rootTable because if a target year is set, we filter the years at the grapher level.
    // Todo: might want to do all filtering a step below the Grapher level?
    get sparkBarColumn() {
        return this.inputTable.rootTable.get(this.mapColumnSlug);
    }
    get sparkBarsData() {
        var _a;
        const tooltipDatum = this.props.tooltipDatum;
        if (!tooltipDatum)
            return [];
        const sparkBarValues = [];
        (_a = this.sparkBarColumn.valueByEntityNameAndTime
            .get(tooltipDatum.seriesName)) === null || _a === void 0 ? void 0 : _a.forEach((value, key) => {
            sparkBarValues.push({
                time: key,
                value: value,
            });
        });
        return Util_1.takeWhile(sparkBarValues, (d) => d.time <= tooltipDatum.time).slice(-this.sparkBarsToDisplay);
    }
    get sparkBarsDomain() {
        const lastVal = Util_1.last(this.sparkBarsData);
        const end = lastVal ? this.sparkBarsDatumXAccessor(lastVal) : 0;
        const start = end > 0 ? end - this.sparkBarsToDisplay + 1 : 0;
        return [start, end];
    }
    get currentSparkBar() {
        const lastVal = Util_1.last(this.sparkBarsData);
        return lastVal ? this.sparkBarsDatumXAccessor(lastVal) : undefined;
    }
    get renderSparkBars() {
        return this.props.manager.mapIsClickable;
    }
    get darkestColorInColorScheme() {
        const { colorScale } = this;
        return colorScale.isColorSchemeInverted
            ? Util_1.first(colorScale.baseColors)
            : Util_1.last(colorScale.baseColors);
    }
    get barColor() {
        const { colorScale } = this;
        return colorScale.singleColorScale &&
            !colorScale.customNumericColorsActive
            ? this.darkestColorInColorScheme
            : undefined;
    }
    get tooltipTarget() {
        var _a;
        return ((_a = this.props.tooltipTarget) !== null && _a !== void 0 ? _a : {
            x: 0,
            y: 0,
            featureId: "Default Tooltip",
        });
    }
    render() {
        var _a;
        const { tooltipDatum, isEntityClickable, targetTime, manager, } = this.props;
        const clickToSelectMessage = manager.type === GrapherConstants_1.ChartTypeName.LineChart
            ? "Click for change over time"
            : "Click to select";
        const { timeColumn } = this.inputTable;
        const { renderSparkBars, barColor, tooltipTarget } = this;
        const displayTime = !timeColumn.isMissing
            ? timeColumn.formatValue(targetTime)
            : targetTime;
        const displayDatumTime = timeColumn && tooltipDatum
            ? timeColumn.formatValue(tooltipDatum.time)
            : (_a = tooltipDatum === null || tooltipDatum === void 0 ? void 0 : tooltipDatum.time.toString()) !== null && _a !== void 0 ? _a : "";
        return (React.createElement(Tooltip_1.Tooltip, { tooltipManager: this.props.manager, key: "mapTooltip", x: tooltipTarget.x, y: tooltipTarget.y, style: { textAlign: "center", padding: "8px" }, offsetX: 15, offsetY: 10, offsetYDirection: "upward" },
            React.createElement("h3", { style: {
                    padding: "0.3em 0.3em",
                    margin: 0,
                    fontWeight: "normal",
                    fontSize: "1em",
                } }, tooltipTarget.featureId ||
                tooltipTarget.featureId.replace(/_/g, " ")),
            React.createElement("div", { style: {
                    margin: 0,
                    padding: "0.3em 0.3em",
                } }, tooltipDatum ? (React.createElement("div", { className: "map-tooltip" },
                React.createElement("div", { className: "trend" },
                    renderSparkBars && (React.createElement("div", { className: "plot" },
                        React.createElement(SparkBars_1.SparkBars, Object.assign({}, this.sparkBarsProps, { currentX: this.currentSparkBar, color: barColor })))),
                    React.createElement("div", { className: "value" +
                            (renderSparkBars ? "" : " no-plot") },
                        React.createElement(SparkBarTimeSeriesValue_1.SparkBarTimeSeriesValue, { className: "current", value: tooltipDatum.displayValue, displayDate: displayDatumTime, valueColor: renderSparkBars ? barColor : "black" }))))) : (`No data for ${displayTime}`)),
            isEntityClickable && (React.createElement("div", null,
                React.createElement("p", { style: {
                        margin: 0,
                        padding: "0.3em 0.9em",
                        fontSize: "13px",
                        opacity: 0.6,
                    } }, clickToSelectMessage)))));
    }
};
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "sparkBarsToDisplay", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "sparkBarsProps", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "mapColumnSlug", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "sparkBarColumn", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "sparkBarsData", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "sparkBarsDomain", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "currentSparkBar", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "renderSparkBars", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "darkestColorInColorScheme", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "barColor", null);
__decorate([
    mobx_1.computed
], MapTooltip.prototype, "tooltipTarget", null);
MapTooltip = __decorate([
    mobx_react_1.observer
], MapTooltip);
exports.MapTooltip = MapTooltip;
//# sourceMappingURL=MapTooltip.js.map