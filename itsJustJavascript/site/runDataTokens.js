"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDataTokens = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const DataToken_1 = require("../site/DataToken");
const LastUpdated_1 = require("./covid/LastUpdated");
const dictionary = {
    LastUpdated: LastUpdated_1.LastUpdated,
};
const runDataTokens = () => {
    const dataTokens = document.querySelectorAll(`[data-type=${DataToken_1.DataToken_name}]`);
    dataTokens.forEach((dataToken) => {
        const token = dataToken.getAttribute("data-token");
        if (!token)
            return;
        const componentProps = JSON.parse(dataToken.innerHTML);
        const Component = dictionary[token];
        if (!Component)
            return;
        react_dom_1.default.render(react_1.default.createElement(Component, Object.assign({}, componentProps)), dataToken.parentElement);
    });
};
exports.runDataTokens = runDataTokens;
//# sourceMappingURL=runDataTokens.js.map