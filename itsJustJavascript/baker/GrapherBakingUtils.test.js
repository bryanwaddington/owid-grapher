"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GrapherBakingUtils_1 = require("./GrapherBakingUtils");
describe(GrapherBakingUtils_1.grapherUrlToSlugAndQueryStr, () => {
    it("can extract a slug", () => {
        const grapherUrl = "https://ourworldindata.org/grapher/soil-lifespans";
        const { slug, queryStr } = GrapherBakingUtils_1.grapherUrlToSlugAndQueryStr(grapherUrl);
        expect(slug).toEqual("soil-lifespans");
        expect(queryStr).toEqual("");
    });
    it("can extract slug and queryStr", () => {
        const grapherUrl = "https://ourworldindata.org/grapher/soil-lifespans?tab=map";
        const { slug, queryStr } = GrapherBakingUtils_1.grapherUrlToSlugAndQueryStr(grapherUrl);
        expect(slug).toEqual("soil-lifespans");
        expect(queryStr).toEqual("?tab=map");
    });
    it("ignores empty query string", () => {
        const grapherUrl = "https://ourworldindata.org/grapher/soil-lifespans?";
        const { slug, queryStr } = GrapherBakingUtils_1.grapherUrlToSlugAndQueryStr(grapherUrl);
        expect(slug).toEqual("soil-lifespans");
        expect(queryStr).toEqual("");
    });
    it("can handle slugs with uppercase letters", () => {
        const grapherUrl = "https://ourworldindata.org/grapher/real-gdp-per-capita-pennWT";
        const { slug, queryStr } = GrapherBakingUtils_1.grapherUrlToSlugAndQueryStr(grapherUrl);
        expect(slug).toEqual("real-gdp-per-capita-pennWT");
        expect(queryStr).toEqual("");
    });
});
describe(GrapherBakingUtils_1.grapherSlugToExportFileKey, () => {
    it("can handle empty query string", () => {
        const slug = "soil-lifespans";
        const queryStr = "";
        expect(GrapherBakingUtils_1.grapherSlugToExportFileKey(slug, queryStr)).toEqual("soil-lifespans");
    });
    it("can handle undefined query string", () => {
        const slug = "soil-lifespans";
        const queryStr = undefined;
        expect(GrapherBakingUtils_1.grapherSlugToExportFileKey(slug, queryStr)).toEqual("soil-lifespans");
    });
    it("can handle non-empty query string", () => {
        const slug = "soil-lifespans";
        const queryStr = "?tab=map";
        expect(GrapherBakingUtils_1.grapherSlugToExportFileKey(slug, queryStr)).toEqual("soil-lifespans-a42c8357c168ebd03c90930b9d3c439b");
    });
    it("can handle slugs with uppercase letters", () => {
        const slug = "real-gdp-per-capita-pennWT";
        const queryStr = "";
        expect(GrapherBakingUtils_1.grapherSlugToExportFileKey(slug, queryStr)).toEqual("real-gdp-per-capita-pennWT");
    });
});
//# sourceMappingURL=GrapherBakingUtils.test.js.map