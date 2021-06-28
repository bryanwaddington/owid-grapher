"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnTheMap = void 0;
const MapTopology_1 = require("./MapTopology");
let _cache;
const isOnTheMap = (entityName) => {
    // Cache the result
    if (!_cache)
        _cache = new Set(MapTopology_1.MapTopology.objects.world.geometries.map((region) => region.id));
    return _cache.has(entityName);
};
exports.isOnTheMap = isOnTheMap;
//# sourceMappingURL=EntitiesOnTheMap.js.map