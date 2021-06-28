"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPalette = void 0;
const BodyDiv_1 = require("../bodyDiv/BodyDiv");
const Util_1 = require("../../clientUtils/Util");
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const CommandPaletteClassName = "CommandPalette";
let CommandPalette = class CommandPalette extends react_1.default.Component {
    static togglePalette() {
        const element = document.getElementsByClassName(CommandPaletteClassName)[0];
        if (element)
            element.style.display =
                element.style.display === "none" ? "block" : "none";
    }
    render() {
        const style = {
            display: this.props.display,
        };
        let lastCat = "";
        const commands = this.props.commands.filter((command) => command.title && command.category);
        const sortedCommands = Util_1.sortBy(commands, "category").map((command, index) => {
            let cat = undefined;
            if (command.category !== lastCat) {
                lastCat = command.category;
                cat = react_1.default.createElement("div", { className: "commandCategory" }, lastCat);
            }
            return (react_1.default.createElement("div", { key: `command${index}` },
                cat,
                react_1.default.createElement("div", { className: "commandOption" },
                    react_1.default.createElement("span", { className: "commandCombo" }, command.combo),
                    react_1.default.createElement("a", { onClick: () => command.fn() }, command.title))));
        });
        return (react_1.default.createElement(BodyDiv_1.BodyDiv, null,
            react_1.default.createElement("div", { className: CommandPaletteClassName, style: style },
                react_1.default.createElement("div", { className: "paletteTitle" }, "Keyboard Shortcuts"),
                sortedCommands)));
    }
};
CommandPalette = __decorate([
    mobx_react_1.observer
], CommandPalette);
exports.CommandPalette = CommandPalette;
//# sourceMappingURL=CommandPalette.js.map