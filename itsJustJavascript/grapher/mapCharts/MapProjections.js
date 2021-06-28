"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProjectionGeos = exports.MapProjectionLabels = exports.MapProjectionName = void 0;
const d3_geo_1 = require("d3-geo");
const d3_geo_projection_1 = require("d3-geo-projection");
// https://github.com/d3/d3-geo-projection/issues/202
// todo: would be nice to get propert types for this and not have to run different code during testing
const projectionToUseDuringJestTesting = d3_geo_1.geoConicConformal();
var MapProjectionName;
(function (MapProjectionName) {
    MapProjectionName["World"] = "World";
    MapProjectionName["Africa"] = "Africa";
    MapProjectionName["NorthAmerica"] = "NorthAmerica";
    MapProjectionName["SouthAmerica"] = "SouthAmerica";
    MapProjectionName["Asia"] = "Asia";
    MapProjectionName["Europe"] = "Europe";
    MapProjectionName["Oceania"] = "Oceania";
})(MapProjectionName = exports.MapProjectionName || (exports.MapProjectionName = {}));
exports.MapProjectionLabels = {
    World: "World",
    Africa: "Africa",
    NorthAmerica: "North America",
    SouthAmerica: "South America",
    Asia: "Asia",
    Europe: "Europe",
    Oceania: "Oceania",
};
exports.MapProjectionGeos = {
    World: d3_geo_1.geoPath().projection(typeof d3_geo_projection_1.geoRobinson === "undefined"
        ? projectionToUseDuringJestTesting
        : d3_geo_projection_1.geoRobinson()),
    Africa: d3_geo_1.geoPath().projection(d3_geo_1.geoConicConformal().rotate([-25, 0]).center([0, 0]).parallels([30, -20])),
    NorthAmerica: d3_geo_1.geoPath().projection(d3_geo_1.geoConicConformal()
        .rotate([98, 0])
        .center([0, 38])
        .parallels([29.5, 45.5])),
    SouthAmerica: d3_geo_1.geoPath().projection(d3_geo_1.geoConicConformal()
        .rotate([68, 0])
        .center([0, -14])
        .parallels([10, -30])),
    // From http://bl.ocks.org/dhoboy/ff8448ace9d5d567390a
    Asia: d3_geo_1.geoPath().projection((typeof d3_geo_projection_1.geoPatterson === "undefined"
        ? projectionToUseDuringJestTesting
        : d3_geo_projection_1.geoPatterson())
        .center([58, 54])
        .scale(150)
        .translate([0, 0])
        .precision(0.1)),
    // From http://bl.ocks.org/espinielli/10587361
    Europe: d3_geo_1.geoPath().projection(d3_geo_1.geoAzimuthalEqualArea()
        .scale(200)
        .translate([262, 1187])
        .clipAngle(180 - 1e-3)
        .precision(1)),
    Oceania: d3_geo_1.geoPath().projection(d3_geo_1.geoConicConformal()
        .rotate([-135, 0])
        .center([0, -20])
        .parallels([-10, -30])),
};
//# sourceMappingURL=MapProjections.js.map