#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GrapherUrlMigrations_1 = require("./GrapherUrlMigrations");
describe(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams, () => {
    it("handles 'modern' query params containing '&'", () => {
        const queryStr = "?tab=chart&country=~East+Asia+%26+Pacific";
        const currentQueryParams = GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams(queryStr);
        expect(currentQueryParams).toEqual({
            country: "~East Asia & Pacific",
            tab: "chart",
        });
    });
    it("handles legacy query params containing '&'", () => {
        const legacyQueryStr = "?tab=chart&country=East%20Asia%20%26%20Pacific";
        const currentQueryParams = GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams(legacyQueryStr);
        expect(currentQueryParams).toEqual({
            country: "~East Asia & Pacific",
            tab: "chart",
        });
    });
});
//# sourceMappingURL=GrapherUrlMigrations.test.js.map