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
exports.Default = void 0;
const React = __importStar(require("react"));
const DownloadTab_1 = require("./DownloadTab");
exports.default = {
    title: "DownloadTab",
    component: DownloadTab_1.DownloadTab,
};
const Default = () => {
    return (React.createElement(DownloadTab_1.DownloadTab, { manager: {
            displaySlug: "some-graph",
            staticSVG: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="850" height="600" viewBox="0 0 850 600">
<rect x="10" y="10" width="30" height="30" fill="blue"/>
</svg>`,
        } }));
};
exports.Default = Default;
//# sourceMappingURL=DownloadTab.stories.js.map