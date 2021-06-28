"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementWithHalo = void 0;
const react_1 = __importDefault(require("react"));
const DefaultHaloStyle = {
    fill: "#fff",
    stroke: "#fff",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: ".25em",
};
const getElementWithHalo = (key, element, styles = {}) => {
    const halo = react_1.default.cloneElement(element, {
        style: Object.assign(Object.assign({}, DefaultHaloStyle), styles),
    });
    return (react_1.default.createElement(react_1.default.Fragment, { key: key },
        halo,
        element));
};
exports.getElementWithHalo = getElementWithHalo;
//# sourceMappingURL=Halos.js.map