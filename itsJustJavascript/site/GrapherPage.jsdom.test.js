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
const GrapherPage_1 = require("./GrapherPage");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const ChartListItemVariant_1 = require("./ChartListItemVariant");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
const mockGrapher = {
    version: 5,
    slug: "share-of-children-with-a-weight-too-low-for-their-height-wasting",
    originUrl: "https://ourworldindata.org/hunger-and-undernourishment/",
    dimensions: [
        {
            variableId: 3512,
            property: GrapherConstants_1.DimensionProperty.y,
        },
    ],
};
let grapher;
let post;
let relatedCharts;
beforeAll(() => {
    grapher = mockGrapher;
    post = {
        id: 2681,
        title: "Hunger and Undernourishment",
        slug: "hunger-and-undernourishment",
        published_at: "Tue Oct 08 2013 17:22:54 GMT+0000 (GMT)",
        status: "publish",
        type: "page",
        updated_at: "Wed Mar 25 2020 14:11:30 GMT+0000 (GMT)",
        content: "",
    };
    relatedCharts = [
        {
            title: "Chart 1",
            slug: "chart-1",
        },
        {
            title: "Chart 2",
            slug: "chart-2",
        },
    ];
});
describe("when the page is rendered", () => {
    let view;
    beforeAll(() => (view = enzyme_1.shallow(React.createElement(GrapherPage_1.GrapherPage, { post: post, grapher: grapher, relatedCharts: relatedCharts, baseGrapherUrl: "/grapher/", baseUrl: "" }))));
    it("preloads the data", () => {
        const path = "/grapher/data/variables/3512.json?v=5";
        const selector = `link[rel="preload"][href="${path}"]`;
        expect(view.find(selector)).toHaveLength(1);
    });
    it("renders a site header", () => {
        expect(view.find(SiteHeader_1.SiteHeader)).toHaveLength(1);
    });
    it("renders a figure", () => {
        const selector = 'figure[data-grapher-src="/grapher/share-of-children-with-a-weight-too-low-for-their-height-wasting"]';
        expect(view.find(selector)).toHaveLength(1);
    });
    it("renders a related content block", () => {
        expect(view.find(ChartListItemVariant_1.ChartListItemVariant)).toHaveLength(2);
    });
    it("renders a site footer", () => {
        expect(view.find(SiteFooter_1.SiteFooter)).toHaveLength(1);
    });
});
//# sourceMappingURL=GrapherPage.jsdom.test.js.map