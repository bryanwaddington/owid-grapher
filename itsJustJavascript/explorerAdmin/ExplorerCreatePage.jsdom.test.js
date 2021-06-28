#! /usr/bin/env jest
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ExplorerCreatePage_1 = require("./ExplorerCreatePage");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe(ExplorerCreatePage_1.ExplorerCreatePage, () => {
    const element = enzyme_1.mount(react_1.default.createElement(ExplorerCreatePage_1.ExplorerCreatePage, { slug: "sample", gitCmsBranchName: "dev", doNotFetch: true }));
    it("renders", () => {
        expect(element.find(`.loading-indicator`).length).toEqual(1);
    });
    const explorerCreatePage = element.instance();
    it("edit methods work", () => {
        expect(explorerCreatePage.isModified).toEqual(false);
    });
});
//# sourceMappingURL=ExplorerCreatePage.jsdom.test.js.map