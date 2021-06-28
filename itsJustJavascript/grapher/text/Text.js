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
exports.Text = void 0;
const React = __importStar(require("react"));
const Bounds_1 = require("../../clientUtils/Bounds");
const Util_1 = require("../../clientUtils/Util");
class Text extends React.Component {
    render() {
        const bounds = Bounds_1.Bounds.forText(this.props.children, {
            fontSize: this.props.fontSize,
            fontFamily: this.props["fontFamily"],
        });
        const y = this.props.y + bounds.height - bounds.height * 0.2;
        return (React.createElement("text", Object.assign({}, Util_1.omit(this.props, ["children"]), { y: y, dangerouslySetInnerHTML: { __html: this.props.children } })));
    }
}
exports.Text = Text;
//# sourceMappingURL=Text.js.map