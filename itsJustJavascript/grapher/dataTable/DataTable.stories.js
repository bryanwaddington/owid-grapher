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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncompleteDataTableComponent = exports.FromLegacyWithTimeRange = exports.FromLegacy = exports.WithTolerance = exports.WithTimeRange = exports.Default = void 0;
const React = __importStar(require("react"));
const DataTable_1 = require("./DataTable");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const DataTable_sample_1 = require("./DataTable.sample");
const GrapherConstants_1 = require("../core/GrapherConstants");
exports.default = {
    title: "DataTable",
    component: DataTable_1.DataTable,
};
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
    timeRange: [1950, 2010],
    entityCount: 7,
});
const Default = () => {
    const manager = {
        table,
    };
    return React.createElement(DataTable_1.DataTable, { manager: manager });
};
exports.Default = Default;
const WithTimeRange = () => {
    const manager = {
        table,
    };
    manager.startTime = 1950;
    manager.endTime = 2000;
    return React.createElement(DataTable_1.DataTable, { manager: manager });
};
exports.WithTimeRange = WithTimeRange;
const WithTolerance = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        timeRange: [2010, 2020],
        entityCount: 3,
    }, 3, {
        tolerance: 1,
    });
    const filteredTable = table.dropRowsAt([0, 10, 11]);
    return (React.createElement("div", null,
        React.createElement(DataTable_1.DataTable, { manager: {
                table,
                startTime: 2010,
                endTime: 2010,
            } }),
        React.createElement("div", null, "One country with data, one with data within tolerance, one outside tolerance:"),
        React.createElement(DataTable_1.DataTable, { manager: {
                startTime: 2010,
                endTime: 2010,
                table: filteredTable,
            } })));
};
exports.WithTolerance = WithTolerance;
const FromLegacy = () => {
    const grapher = DataTable_sample_1.childMortalityGrapher();
    return React.createElement(DataTable_1.DataTable, { manager: grapher });
};
exports.FromLegacy = FromLegacy;
const FromLegacyWithTimeRange = () => {
    const grapher = DataTable_sample_1.childMortalityGrapher({
        type: GrapherConstants_1.ChartTypeName.LineChart,
        tab: GrapherConstants_1.GrapherTabOption.chart,
    });
    grapher.startHandleTimeBound = 1950;
    grapher.endHandleTimeBound = 2019;
    return React.createElement(DataTable_1.DataTable, { manager: grapher });
};
exports.FromLegacyWithTimeRange = FromLegacyWithTimeRange;
const IncompleteDataTableComponent = () => {
    const grapher = DataTable_sample_1.IncompleteDataTable();
    grapher.timelineHandleTimeBounds = [2000, 2000];
    return React.createElement(DataTable_1.DataTable, { manager: grapher });
};
exports.IncompleteDataTableComponent = IncompleteDataTableComponent;
// grapher.timeDomain = [2009, 2017]
// Todo: how can I get this to show a closest time popup?
//# sourceMappingURL=DataTable.stories.js.map