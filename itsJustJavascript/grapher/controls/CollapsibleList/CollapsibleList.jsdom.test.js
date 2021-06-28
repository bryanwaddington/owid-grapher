#! /usr/bin/env jest
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
const React = __importStar(require("react"));
const CollapsibleList_1 = require("./CollapsibleList");
const CollapsibleList_sampleInput_1 = require("./CollapsibleList.sampleInput");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("when you render a collapsible list", () => {
    test("something renders", () => {
        const view = enzyme_1.shallow(React.createElement(CollapsibleList_1.CollapsibleList, null, CollapsibleList_sampleInput_1.collapsibleListSampleItems));
        expect(view.find(".list-item")).not.toHaveLength(0);
    });
});
test("testing numItemsVisible utility function", () => {
    expect(CollapsibleList_1.numItemsVisible([], 10, 1)).toEqual(0);
    expect(CollapsibleList_1.numItemsVisible([1], 10, 1)).toEqual(1);
    expect(CollapsibleList_1.numItemsVisible([2], 10, 9)).toEqual(0);
    expect(CollapsibleList_1.numItemsVisible([1], 10, 9)).toEqual(1);
    expect(CollapsibleList_1.numItemsVisible([5, 5, 5], 15, 0)).toEqual(3);
    expect(CollapsibleList_1.numItemsVisible([5, 5, 5], 15, 1)).toEqual(2);
    expect(CollapsibleList_1.numItemsVisible([5, 5, 5], 0, 1)).toEqual(0);
});
//# sourceMappingURL=CollapsibleList.jsdom.test.js.map