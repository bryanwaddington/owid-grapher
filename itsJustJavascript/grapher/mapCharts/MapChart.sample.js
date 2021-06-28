"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyMapGrapher = void 0;
const GrapherConstants_1 = require("../core/GrapherConstants");
exports.legacyMapGrapher = {
    hasMapTab: true,
    tab: GrapherConstants_1.GrapherTabOption.map,
    map: {
        timeTolerance: 5,
    },
    dimensions: [
        {
            variableId: 3512,
            property: GrapherConstants_1.DimensionProperty.y,
            display: {
                name: "",
                unit: "% of children under 5",
                tolerance: 5,
                isProjection: false,
            },
        },
    ],
    owidDataset: {
        variables: {
            "3512": {
                years: [2000, 2010, 2010],
                entities: [207, 15, 207],
                values: [4, 20, 34],
                id: 3512,
                shortUnit: "%",
            },
        },
        entityKey: {
            "15": { name: "Afghanistan", id: 15, code: "AFG" },
            "207": { name: "Iceland", id: 207, code: "ISL" },
        },
    },
    queryStr: "?time=2002",
};
//# sourceMappingURL=MapChart.sample.js.map