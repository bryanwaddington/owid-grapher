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
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
const GlobalEntitySelector_1 = require("./GlobalEntitySelector");
const SelectionArray_1 = require("../../selection/SelectionArray");
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("when you render a GlobalEntitySelector", () => {
    test("something renders", () => {
        const view = enzyme_1.shallow(React.createElement(GlobalEntitySelector_1.GlobalEntitySelector, { selection: new SelectionArray_1.SelectionArray() }));
        expect(view.find(".global-entity-control")).not.toHaveLength(0);
    });
    test("graphers/explorers are properly updated", () => {
        const grapherSelection = new SelectionArray_1.SelectionArray();
        const explorerSelection = new SelectionArray_1.SelectionArray();
        const graphersToUpdate = new Set([grapherSelection, explorerSelection]);
        const selector = new GlobalEntitySelector_1.GlobalEntitySelector({
            selection: new SelectionArray_1.SelectionArray(),
            graphersAndExplorersToUpdate: graphersToUpdate,
        });
        selector.updateSelection(["Breckistan"]);
        expect(grapherSelection.selectedEntityNames).toEqual(["Breckistan"]);
        expect(explorerSelection.selectedEntityNames).toEqual(["Breckistan"]);
    });
});
//# sourceMappingURL=GlobalEntitySelector.jsdom.test.js.map