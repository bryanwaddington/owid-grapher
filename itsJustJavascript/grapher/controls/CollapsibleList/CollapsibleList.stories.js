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
exports.MoreButtonComponent = exports.CollapsibleListComponent = void 0;
const React = __importStar(require("react"));
const CollapsibleList_1 = require("./CollapsibleList");
const CollapsibleList_sampleInput_1 = require("./CollapsibleList.sampleInput");
exports.default = {
    title: "CollapsibleList",
    component: CollapsibleList_1.CollapsibleList,
};
const CollapsibleListComponent = () => {
    return React.createElement(CollapsibleList_1.CollapsibleList, null, CollapsibleList_sampleInput_1.collapsibleListSampleItems);
};
exports.CollapsibleListComponent = CollapsibleListComponent;
const MoreButtonComponent = () => {
    const options = [
        React.createElement("div", { key: "option1" }, "option1"),
        React.createElement("div", { key: "option2" }, "option2"),
        React.createElement("div", { key: "option3" }, "option3"),
    ];
    return React.createElement(CollapsibleList_1.MoreButton, { options: options });
};
exports.MoreButtonComponent = MoreButtonComponent;
//# sourceMappingURL=CollapsibleList.stories.js.map