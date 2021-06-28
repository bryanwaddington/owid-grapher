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
exports.Default = void 0;
const React = __importStar(require("react"));
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const Spreadsheet_1 = require("./Spreadsheet");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const GrapherConstants_1 = require("../core/GrapherConstants");
const ChartTypeMap_1 = require("../chart/ChartTypeMap");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
const ChartTypeSwitcher_1 = require("../chart/ChartTypeSwitcher");
exports.default = {
    title: "Spreadsheet",
    component: Spreadsheet_1.Spreadsheet,
};
const getRandomTable = () => OwidTableSynthesizers_1.SynthesizeGDPTable({
    entityCount: 2,
    timeRange: [2020, 2024],
})
    .dropColumns([
    OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
    OwidTableSynthesizers_1.SampleColumnSlugs.Population,
    OwidTableConstants_1.OwidTableSlugs.entityCode,
    OwidTableConstants_1.OwidTableSlugs.entityId,
])
    .sortColumns([OwidTableConstants_1.OwidTableSlugs.entityName, OwidTableConstants_1.OwidTableSlugs.year]);
let Editor = class Editor extends React.Component {
    constructor() {
        super(...arguments);
        this.table = getRandomTable();
        this.chartTypeName = GrapherConstants_1.ChartTypeName.LineChart;
    }
    shuffleTable() {
        this.table = getRandomTable();
    }
    get yColumnSlugs() {
        return this.table.suggestedYColumnSlugs;
    }
    get xColumnSlug() {
        var _a;
        return (_a = this.table.timeColumn) === null || _a === void 0 ? void 0 : _a.slug;
    }
    get selection() {
        return this.table.availableEntityNames;
    }
    changeChartType(type) {
        this.chartTypeName = type;
    }
    render() {
        var _a;
        const ChartClass = (_a = ChartTypeMap_1.ChartComponentClassMap.get(this.chartTypeName)) !== null && _a !== void 0 ? _a : ChartTypeMap_1.DefaultChartClass;
        return (React.createElement("div", null,
            React.createElement(Spreadsheet_1.Spreadsheet, { manager: this }),
            React.createElement("svg", { width: 400, height: 300 },
                React.createElement(ChartClass, { manager: this, bounds: new Bounds_1.Bounds(0, 0, 400, 300) })),
            React.createElement("button", { onClick: this.shuffleTable }, "Shuffle"),
            React.createElement(ChartTypeSwitcher_1.ChartTypeSwitcher, { onChange: this.changeChartType })));
    }
};
__decorate([
    mobx_1.observable.ref
], Editor.prototype, "table", void 0);
__decorate([
    mobx_1.action.bound
], Editor.prototype, "shuffleTable", null);
__decorate([
    mobx_1.computed
], Editor.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], Editor.prototype, "xColumnSlug", null);
__decorate([
    mobx_1.observable
], Editor.prototype, "chartTypeName", void 0);
__decorate([
    mobx_1.computed
], Editor.prototype, "selection", null);
__decorate([
    mobx_1.action.bound
], Editor.prototype, "changeChartType", null);
Editor = __decorate([
    mobx_react_1.observer
], Editor);
const Default = () => React.createElement(Editor, null);
exports.Default = Default;
//# sourceMappingURL=Spreadsheet.stories.js.map