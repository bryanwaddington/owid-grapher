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
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
// This just does a sanity check that all the stories can mount.
// This file might not be necessary as there may be a way to do something similar with Storybook/Jest.
// For now, to get a list of all stories for updating this file:
// git ls-tree -r master --name-only | grep .stories.tsx | sed 's/.tsx//'
const Explorer = __importStar(require("../explorer/Explorer.stories"));
const runTests = (storybook) => {
    const defaults = storybook.default;
    Object.keys(storybook).forEach((key) => {
        if (key === "default")
            return;
        describe(defaults.title, () => {
            const args = {};
            it(`should load ${key}`, () => {
                expect(enzyme_1.mount(storybook[key](args))).toBeTruthy();
            });
        });
    });
};
runTests(Explorer);
//# sourceMappingURL=stories.jsdom.test.js.map