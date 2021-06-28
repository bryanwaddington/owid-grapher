#! /usr/bin/env jest
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Grapher_1 = require("../core/Grapher");
const MapChart_sample_1 = require("./MapChart.sample");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
const grapherWrapper = enzyme_1.mount(react_1.default.createElement(Grapher_1.Grapher, Object.assign({}, MapChart_sample_1.legacyMapGrapher)));
test("map tooltip renders iff mouseenter", () => {
    expect(grapherWrapper.find(".map-tooltip")).toHaveLength(0);
    const grapherWrapperWithHover = grapherWrapper
        .find("path")
        .findWhere((node) => node.key() === "Iceland")
        .simulate("mouseenter", {
        clientX: 50,
        clientY: 50,
    })
        .update();
    expect(grapherWrapperWithHover.find(".map-tooltip")).toHaveLength(1);
    const tooltipWrapper = grapherWrapperWithHover.find(".map-tooltip");
    expect(tooltipWrapper.find(".bar")).toHaveLength(20);
    expect(tooltipWrapper.find(".count").text()).toEqual("4% of children under 5 ");
});
//# sourceMappingURL=MapTooltip.jsdom.test.js.map