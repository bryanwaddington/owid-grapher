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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CovidDoublingTooltip = void 0;
const React = __importStar(require("react"));
const CovidUtils_1 = require("./CovidUtils");
const CovidDoublingTooltip = (props) => {
    const { noun, accessor } = props;
    const { latestDay, halfDay, ratio, length } = props.doublingRange;
    const exactRatioWording = ratio.toFixed(1) === "2.0"
        ? "doubled"
        : `increased by a factor of ${ratio.toFixed(1)}`;
    return (React.createElement("div", { className: "covid-tooltip" },
        "The number of total confirmed ",
        noun(),
        " in ",
        latestDay.location,
        " has",
        " ",
        React.createElement("span", { className: "growth-rate" }, exactRatioWording),
        " in the",
        " ",
        React.createElement("span", { className: "period" },
            "last ",
            length,
            " days"),
        ".",
        React.createElement("table", { className: "values" },
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", { className: "value from-color" },
                        CovidUtils_1.formatInt(accessor(halfDay)),
                        " ",
                        noun(accessor(halfDay))),
                    React.createElement("td", null, "on"),
                    React.createElement("td", { className: "date from-color" }, CovidUtils_1.formatDate(halfDay.date))),
                React.createElement("tr", null,
                    React.createElement("td", { className: "value to-color" },
                        CovidUtils_1.formatInt(accessor(latestDay)),
                        " ",
                        noun(accessor(latestDay))),
                    React.createElement("td", null, "on"),
                    React.createElement("td", { className: "date to-color" }, CovidUtils_1.formatDate(latestDay.date)))))));
};
exports.CovidDoublingTooltip = CovidDoublingTooltip;
//# sourceMappingURL=CovidDoublingTooltip.js.map