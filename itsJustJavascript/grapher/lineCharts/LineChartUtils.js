"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnToLineChartSeriesArray = void 0;
const GrapherConstants_1 = require("../core/GrapherConstants");
const columnToLineChartSeriesArray = (col, seriesStrategy, canSelectMultipleEntities) => {
    const { isProjection, owidRowsByEntityName } = col;
    const entityNames = Array.from(owidRowsByEntityName.keys());
    return entityNames.map((entityName) => {
        let seriesName;
        if (seriesStrategy === GrapherConstants_1.SeriesStrategy.entity) {
            seriesName = entityName;
        }
        else {
            if (canSelectMultipleEntities) {
                seriesName = `${entityName} - ${col.displayName}`;
            }
            else {
                seriesName = col.displayName;
            }
        }
        return {
            points: owidRowsByEntityName.get(entityName).map((row) => {
                return {
                    x: row.time,
                    y: row.value,
                };
            }),
            seriesName,
            isProjection,
            color: "#000", // tmp
        };
    });
};
exports.columnToLineChartSeriesArray = columnToLineChartSeriesArray;
//# sourceMappingURL=LineChartUtils.js.map