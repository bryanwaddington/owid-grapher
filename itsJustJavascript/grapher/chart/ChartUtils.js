"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSelectionArray = exports.makeClipPath = exports.autoDetectSeriesStrategy = exports.getSeriesKey = exports.getDefaultFailMessage = exports.autoDetectYColumnSlugs = void 0;
const react_1 = __importDefault(require("react"));
const GrapherConstants_1 = require("../core/GrapherConstants");
const SelectionArray_1 = require("../selection/SelectionArray");
const autoDetectYColumnSlugs = (manager) => {
    if (manager.yColumnSlugs && manager.yColumnSlugs.length)
        return manager.yColumnSlugs;
    if (manager.yColumnSlug)
        return [manager.yColumnSlug];
    return manager.table.numericColumnSlugs;
};
exports.autoDetectYColumnSlugs = autoDetectYColumnSlugs;
const getDefaultFailMessage = (manager) => {
    if (manager.table.rootTable.isBlank)
        return `No table loaded yet.`;
    if (manager.table.rootTable.entityNameColumn.isMissing)
        return `Table is missing an EntityName column.`;
    if (manager.table.rootTable.timeColumn.isMissing)
        return `Table is missing a Time column.`;
    const yColumnSlugs = exports.autoDetectYColumnSlugs(manager);
    if (!yColumnSlugs.length)
        return "Missing Y axis column";
    const selection = exports.makeSelectionArray(manager);
    if (!selection.hasSelection)
        return `No ${selection.entityType} selected`;
    return "";
};
exports.getDefaultFailMessage = getDefaultFailMessage;
const getSeriesKey = (series, suffix) => {
    return `${series.seriesName}-${series.color}-${series.isProjection ? "projection" : ""}${suffix ? "-" + suffix : ""}`;
};
exports.getSeriesKey = getSeriesKey;
const autoDetectSeriesStrategy = (manager, hasNormalAndProjectedSeries) => {
    if (manager.seriesStrategy)
        return manager.seriesStrategy;
    const columnThreshold = hasNormalAndProjectedSeries ? 2 : 1;
    return exports.autoDetectYColumnSlugs(manager).length > columnThreshold
        ? GrapherConstants_1.SeriesStrategy.column
        : GrapherConstants_1.SeriesStrategy.entity;
};
exports.autoDetectSeriesStrategy = autoDetectSeriesStrategy;
const makeClipPath = (renderUid, box) => {
    const id = `boundsClip-${renderUid}`;
    return {
        id: `url(#${id})`,
        element: (react_1.default.createElement("defs", null,
            react_1.default.createElement("clipPath", { id: id },
                react_1.default.createElement("rect", Object.assign({}, box))))),
    };
};
exports.makeClipPath = makeClipPath;
const makeSelectionArray = (manager) => {
    var _a;
    return manager.selection instanceof SelectionArray_1.SelectionArray
        ? manager.selection
        : new SelectionArray_1.SelectionArray((_a = manager.selection) !== null && _a !== void 0 ? _a : []);
};
exports.makeSelectionArray = makeSelectionArray;
//# sourceMappingURL=ChartUtils.js.map