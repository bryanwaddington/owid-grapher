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
exports.WithCommands = void 0;
const React = __importStar(require("react"));
const CommandPalette_1 = require("../controls/CommandPalette");
exports.default = {
    title: "CommandPalette",
    component: CommandPalette_1.CommandPalette,
};
const WithCommands = () => {
    const demoCommands = [
        {
            combo: "ctrl+o",
            fn: () => { },
            title: "Open",
            category: "File",
        },
        {
            combo: "ctrl+s",
            fn: () => { },
            title: "Save",
            category: "File",
        },
        {
            combo: "ctrl+c",
            fn: () => { },
            title: "Copy",
            category: "Edit",
        },
    ];
    return React.createElement(CommandPalette_1.CommandPalette, { commands: demoCommands, display: "block" });
};
exports.WithCommands = WithCommands;
//# sourceMappingURL=CommandPalette.stories.js.map