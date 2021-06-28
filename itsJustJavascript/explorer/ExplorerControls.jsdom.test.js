#! /usr/bin/env jest
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ExplorerConstants_1 = require("./ExplorerConstants");
const ExplorerControls_1 = require("./ExplorerControls");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe(ExplorerControls_1.ExplorerControlPanel, () => {
    const options = [
        {
            label: "Paper",
            available: true,
            value: "paper",
        },
        {
            label: "Plastic",
            available: true,
            value: "plastic",
        },
    ];
    const element = enzyme_1.mount(react_1.default.createElement(ExplorerControls_1.ExplorerControlPanel, { choice: {
            title: "Some decision",
            value: "",
            options,
            type: ExplorerConstants_1.ExplorerControlType.Radio,
        }, explorerSlug: "explorer_slug", isMobile: false }));
    it("renders options", () => {
        expect(element.find(`.AvailableOption`).length).toEqual(2);
    });
});
//# sourceMappingURL=ExplorerControls.jsdom.test.js.map