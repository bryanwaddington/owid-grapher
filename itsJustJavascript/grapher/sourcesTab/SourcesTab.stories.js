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
exports.NoSources = exports.WithSources = void 0;
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const React = __importStar(require("react"));
const SourcesTab_1 = require("./SourcesTab");
exports.default = {
    title: "SourcesTab",
    component: SourcesTab_1.SourcesTab,
};
const WithSources = () => (React.createElement(SourcesTab_1.SourcesTab, { manager: { columnsWithSources: OwidTableSynthesizers_1.SynthesizeGDPTable().columnsAsArray } }));
exports.WithSources = WithSources;
const NoSources = () => (React.createElement(SourcesTab_1.SourcesTab, { manager: { columnsWithSources: [] } }));
exports.NoSources = NoSources;
//# sourceMappingURL=SourcesTab.stories.js.map