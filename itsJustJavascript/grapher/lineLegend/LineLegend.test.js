#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AxisConfig_1 = require("../axis/AxisConfig");
const LineLegend_1 = require("./LineLegend");
const manager = {
    labelSeries: [
        {
            seriesName: "Canada",
            label: "Canada",
            color: "red",
            yValue: 50,
            annotation: "A country in North America",
        },
        {
            seriesName: "Mexico",
            label: "Mexico",
            color: "green",
            yValue: 20,
            annotation: "Below Canada",
        },
    ],
    legendX: 200,
    focusedSeriesNames: [],
    verticalAxis: new AxisConfig_1.AxisConfig({ min: 0, max: 100 }).toVerticalAxis(),
};
it("can create a new legend", () => {
    const legend = new LineLegend_1.LineLegend({ manager });
    expect(legend.sizedLabels.length).toEqual(2);
});
//# sourceMappingURL=LineLegend.test.js.map