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
exports.SparkBarTimeSeriesValue = void 0;
const React = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faQuestionCircle_1 = require("@fortawesome/free-regular-svg-icons/faQuestionCircle");
const Tippy_1 = require("../chart/Tippy");
const SparkBarTimeSeriesValue = ({ value, latest, tooltip, className, displayDate, valueColor, }) => (React.createElement("div", { className: classnames_1.default("time-series-value", className) }, value !== undefined ? (React.createElement(React.Fragment, null,
    React.createElement("span", { className: "count" },
        React.createElement("span", { style: { color: valueColor } }, value),
        " ",
        tooltip && (React.createElement(Tippy_1.Tippy, { content: tooltip, maxWidth: 250 },
            React.createElement("span", { className: "help-icon" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faQuestionCircle_1.faQuestionCircle }))))),
    React.createElement("span", { className: classnames_1.default("date", { latest: latest }) }, displayDate))) : undefined));
exports.SparkBarTimeSeriesValue = SparkBarTimeSeriesValue;
//# sourceMappingURL=SparkBarTimeSeriesValue.js.map