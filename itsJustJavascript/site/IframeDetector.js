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
exports.IFrameDetector = void 0;
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const React = __importStar(require("react"));
const IFrameDetector = () => (React.createElement("script", { dangerouslySetInnerHTML: {
        __html: `if (window != window.top) document.documentElement.classList.add('${GrapherConstants_1.GRAPHER_IS_IN_IFRAME_CLASS}')`,
    } }));
exports.IFrameDetector = IFrameDetector;
//# sourceMappingURL=IframeDetector.js.map