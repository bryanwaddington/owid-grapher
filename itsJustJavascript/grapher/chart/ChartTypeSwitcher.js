"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartTypeSwitcher = void 0;
const react_1 = __importDefault(require("react"));
const GrapherConstants_1 = require("../core/GrapherConstants");
// Just a utility for testing
class ChartTypeSwitcher extends react_1.default.Component {
    render() {
        return (react_1.default.createElement("select", { onChange: (event) => this.props.onChange(event.target.value) }, Object.values(GrapherConstants_1.ChartTypeName).map((value) => (react_1.default.createElement("option", { key: value, value: value }, value)))));
    }
}
exports.ChartTypeSwitcher = ChartTypeSwitcher;
//# sourceMappingURL=ChartTypeSwitcher.js.map