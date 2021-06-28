#! yarn testJest
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Explorer_1 = require("./Explorer");
const Explorer_sample_1 = require("./Explorer.sample");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe(Explorer_1.Explorer, () => {
    const title = "AlphaBeta";
    const element = enzyme_1.mount(Explorer_sample_1.SampleExplorerOfGraphers());
    it("renders", () => {
        expect(element.find(".ExplorerHeaderBox").text()).toContain("CO₂ Data Explorer");
        expect(element.find(`.HeaderHTML`).text()).toContain(title);
        expect(element.find(`.loading-indicator`).length).toEqual(0);
        expect(element.text()).toContain("Kingdom");
    });
    it("each grapher has its own set of URL params/options are preserved even when the grapher changes", () => {
        const explorer = element.instance();
        expect(explorer.queryParams.tab).toBeUndefined();
        explorer.onChangeChoice("Gas")("All GHGs (CO₂eq)");
        if (explorer.grapher)
            explorer.grapher.tab = GrapherConstants_1.GrapherTabOption.table;
        else
            throw Error("where's the grapher?");
        expect(explorer.queryParams.tab).toEqual("table");
        explorer.onChangeChoice("Gas")("CO₂");
        expect(explorer.queryParams.tab).toBeUndefined();
    });
    it("recovers country selection from URL params", () => {
        const element = enzyme_1.mount(Explorer_sample_1.SampleExplorerOfGraphers({ queryStr: "?country=IRL" }));
        const explorer = element.instance();
        expect(explorer.selection.selectedEntityNames).toEqual(["Ireland"]);
    });
    it("serializes all choice params in URL", () => {
        const element = enzyme_1.mount(Explorer_sample_1.SampleExplorerOfGraphers());
        const explorer = element.instance();
        expect(explorer.queryParams).toMatchObject({
            Accounting: "Production-based",
            Count: "Per country",
            Fuel: "Total",
            Gas: "CO₂",
            "Relative to world total": "false",
        });
    });
});
describe("inline data explorer", () => {
    const element = enzyme_1.mount(Explorer_sample_1.SampleInlineDataExplorer());
    const explorer = element.instance();
    it("renders", () => {
        var _a, _b, _c, _d;
        expect(element.find(".ExplorerHeaderBox").text()).toContain("Sample Explorer");
        expect(explorer.queryParams).toMatchObject({
            Test: "Scatter",
        });
        expect((_a = explorer.grapher) === null || _a === void 0 ? void 0 : _a.xSlug).toEqual("x");
        expect((_b = explorer.grapher) === null || _b === void 0 ? void 0 : _b.ySlugs).toEqual("y");
        expect((_c = explorer.grapher) === null || _c === void 0 ? void 0 : _c.colorSlug).toEqual("color");
        expect((_d = explorer.grapher) === null || _d === void 0 ? void 0 : _d.sizeSlug).toEqual("size");
    });
    it("clears column slugs that don't exist in current row", () => {
        var _a, _b, _c, _d;
        explorer.onChangeChoice("Test")("Line");
        expect(explorer.queryParams).toMatchObject({
            Test: "Line",
        });
        expect((_a = explorer.grapher) === null || _a === void 0 ? void 0 : _a.xSlug).toEqual(undefined);
        expect((_b = explorer.grapher) === null || _b === void 0 ? void 0 : _b.ySlugs).toEqual("y");
        expect((_c = explorer.grapher) === null || _c === void 0 ? void 0 : _c.colorSlug).toEqual(undefined);
        expect((_d = explorer.grapher) === null || _d === void 0 ? void 0 : _d.sizeSlug).toEqual(undefined);
    });
});
//# sourceMappingURL=Explorer.jsdom.test.js.map