"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyDiv = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
// Render a component on the Body instead of inside the current Tree.
// https://reactjs.org/docs/portals.html
class BodyDiv extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement("div");
    }
    componentDidMount() {
        document.body.appendChild(this.el);
    }
    componentWillUnmount() {
        document.body.removeChild(this.el);
    }
    render() {
        return react_dom_1.default.createPortal(this.props.children, this.el);
    }
}
exports.BodyDiv = BodyDiv;
//# sourceMappingURL=BodyDiv.js.map