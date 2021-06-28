"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValue = exports.processTemplate = exports.DATA_VALUE = void 0;
const react_1 = __importDefault(require("react"));
exports.DATA_VALUE = "DataValue";
const processTemplate = (props) => {
    return props.template
        .replace("%value", props.value.toString())
        .replace("%year", props.year.toString() || "")
        .replace("%unit", props.unit || "")
        .replace("%entity", props.entityName || "");
};
exports.processTemplate = processTemplate;
const DataValue = ({ label }) => {
    return (react_1.default.createElement("span", { className: "data-value", dangerouslySetInnerHTML: {
            __html: label,
        } }));
};
exports.DataValue = DataValue;
//# sourceMappingURL=DataValue.js.map