#! /usr/bin/env jest
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const DataTable_1 = require("./DataTable");
const GrapherConstants_1 = require("../core/GrapherConstants");
const DataTable_sample_1 = require("./DataTable.sample");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("when you render a table", () => {
    let view;
    beforeAll(() => {
        const grapher = DataTable_sample_1.childMortalityGrapher();
        view = enzyme_1.mount(React.createElement(DataTable_1.DataTable, { manager: grapher }));
    });
    it("renders a table", () => {
        expect(view.find("table.data-table")).toHaveLength(1);
    });
    it("renders a Country header", () => {
        expect(view.find("thead th.entity").text()).toContain("Country");
    });
    it("renders a variable name in header", () => {
        const cell = view.find("thead th.dimension .name");
        expect(cell.text()).toContain("Child mortality");
    });
    it("renders a unit name in header", () => {
        const cell = view.find("thead th.dimension .unit");
        expect(cell.text()).toContain("percent");
    });
    it("renders 'percent' in the column header when unit is '%'", () => {
        const cell = view.find("thead th.dimension .unit");
        expect(cell.text()).toContain("percent");
    });
    it("renders a row for each country", () => {
        expect(view.find("tbody tr")).toHaveLength(2);
    });
    it("renders the name of each country", () => {
        const cell = view.find("tbody tr td.entity").first();
        expect(cell.text()).toBe("Afghanistan");
    });
    it("renders the value for each country", () => {
        const cell = view.find("tbody tr td.dimension").first();
        expect(cell.text()).toBe("21.56%");
    });
    it("renders the unit in cell values when the unit is '%'", () => {
        const cell = view.find("tbody tr td.dimension").first();
        expect(cell.text()).toContain("%");
    });
});
describe("when you select a range of years", () => {
    let view;
    beforeAll(() => {
        const grapher = DataTable_sample_1.childMortalityGrapher({
            type: GrapherConstants_1.ChartTypeName.LineChart,
            tab: GrapherConstants_1.GrapherTabOption.table,
        });
        grapher.timelineHandleTimeBounds = [1950, 2019];
        view = enzyme_1.mount(React.createElement(DataTable_1.DataTable, { manager: grapher }));
    });
    it("header is split into two rows", () => {
        expect(view.find("thead tr")).toHaveLength(2);
    });
    it("entity header cell spans 2 rows", () => {
        const cell = view.find("thead .entity").first();
        expect(cell.prop("rowSpan")).toBe(2);
    });
    it("renders start values", () => {
        const cell = view.find("tbody .dimension-start").first();
        expect(cell.text()).toBe("22.45%");
    });
    it("renders end values", () => {
        const cell = view.find("tbody .dimension-end").first();
        expect(cell.text()).toBe("21.56%");
    });
    it("renders absolute change values", () => {
        const cell = view.find("tbody .dimension-delta").first();
        expect(cell.text()).toBe("-0.89 pp");
    });
    it("renders relative change values", () => {
        const cell = view.find("tbody .dimension-deltaRatio").first();
        expect(cell.text()).toBe("-4%");
    });
});
describe("when the table doesn't have data for all rows", () => {
    const grapher = DataTable_sample_1.IncompleteDataTable();
    grapher.timelineHandleTimeBounds = [2000, 2000];
    const view = enzyme_1.shallow(React.createElement(DataTable_1.DataTable, { manager: grapher }));
    it("renders no value when data is not available for years within the tolerance", () => {
        expect(view.find("tbody .dimension").at(0).first().text()).toBe("");
    });
    it("renders a tolerance notice when data is not from targetYear", () => {
        expect(view.find(".closest-time-notice-icon").text()).toContain("2001");
    });
});
describe("when you try to hide countries", () => {
    let grapher;
    let view;
    beforeAll(() => {
        grapher = DataTable_sample_1.childMortalityGrapher();
        view = enzyme_1.shallow(React.createElement(DataTable_1.DataTable, { manager: grapher }));
    });
    it("initially renders small countries", () => {
        expect(view.find("tbody tr")).toHaveLength(2);
    });
    it("renders no small countries after filter is added", () => {
        grapher.minPopulationFilter = 1e6;
        expect(view.find("tbody tr")).toHaveLength(1);
    });
});
//# sourceMappingURL=DataTable.jsdom.test.js.map