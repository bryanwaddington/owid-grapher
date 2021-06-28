#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MapConfig_1 = require("./MapConfig");
const MapProjections_1 = require("./MapProjections");
it("can serialize for saving", () => {
    expect(new MapConfig_1.MapConfig().toObject()).toEqual({});
    const map = new MapConfig_1.MapConfig();
    map.hideTimeline = true;
    map.projection = MapProjections_1.MapProjectionName.Africa;
    expect(map.toObject()).toEqual({
        hideTimeline: true,
        projection: "Africa",
    });
});
it("works with legacy variableId", () => {
    const map = new MapConfig_1.MapConfig({ variableId: 23 });
    expect(map.columnSlug).toEqual("23");
    expect(map.toObject()).toEqual({
        variableId: 23,
    });
});
//# sourceMappingURL=MapConfig.test.js.map