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
const RelatedCharts_1 = require("./RelatedCharts");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
const charts = [
    {
        title: "Chart 1",
        slug: "chart-1",
    },
    {
        title: "Chart 2",
        slug: "chart-2",
    },
];
it("renders active chart links and loads respective chart on click", () => {
    const wrapper = enzyme_1.mount(React.createElement(RelatedCharts_1.RelatedCharts, { charts: charts }));
    expect(wrapper.find("li")).toHaveLength(2);
    expect(wrapper.find("li").first().hasClass("active")).toEqual(true);
    expect(wrapper.find("li").first().text()).toBe("Chart 1");
    wrapper.find("a").forEach((link, idx) => {
        link.simulate("click");
        expect(wrapper.find("figure")).toHaveLength(1);
        expect(wrapper.find(`figure[data-grapher-src="/grapher/${charts[idx].slug}"]`)).toHaveLength(1);
        // should have forced re-render by changing the `key`
        expect(wrapper.find("figure").key()).toEqual(charts[idx].slug);
    });
    expect(wrapper.find("li").last().hasClass("active")).toEqual(true);
});
//# sourceMappingURL=RelatedCharts.jsdom.test.js.map