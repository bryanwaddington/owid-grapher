#! /usr/bin/env jest
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Grapher_1 = require("../core/Grapher");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const GrapherConstants_1 = require("../core/GrapherConstants");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
const TestGrapherConfig = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 10 });
    return {
        table,
        selectedEntityNames: table.sampleEntityName(5),
        dimensions: [
            {
                slug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
                property: GrapherConstants_1.DimensionProperty.y,
                variableId: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
            },
        ],
    };
};
test("clicking the sources footer changes tabs", () => {
    const mountedGrapher = enzyme_1.mount(react_1.default.createElement(Grapher_1.Grapher, Object.assign({}, TestGrapherConfig)));
    expect(mountedGrapher.find(".sourcesTab")).toHaveLength(0);
    expect(mountedGrapher.find(".SourcesFooterHTML")).toHaveLength(1);
    const mountedGrapherPostClick = mountedGrapher
        .find(".SourcesFooterHTML")
        .find(".clickable")
        .simulate("click")
        .update();
    expect(mountedGrapherPostClick.find(".sourcesTab")).toHaveLength(1);
});
//# sourceMappingURL=Footer.jsdom.test.js.map