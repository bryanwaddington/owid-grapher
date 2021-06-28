"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortIcon = void 0;
const react_1 = __importDefault(require("react"));
const classnames_1 = __importDefault(require("classnames"));
const faSortAlphaUpAlt_1 = require("@fortawesome/free-solid-svg-icons/faSortAlphaUpAlt");
const faSortAlphaDown_1 = require("@fortawesome/free-solid-svg-icons/faSortAlphaDown");
const faSortAmountUpAlt_1 = require("@fortawesome/free-solid-svg-icons/faSortAmountUpAlt");
const faSortAmountDown_1 = require("@fortawesome/free-solid-svg-icons/faSortAmountDown");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
function SortIcon(props) {
    var _a, _b;
    const type = (_a = props.type) !== null && _a !== void 0 ? _a : "numeric";
    const isActiveIcon = (_b = props.isActiveIcon) !== null && _b !== void 0 ? _b : false;
    let faIcon;
    if (type === "text")
        faIcon =
            props.order === CoreTableConstants_1.SortOrder.desc ? faSortAlphaUpAlt_1.faSortAlphaUpAlt : faSortAlphaDown_1.faSortAlphaDown;
    else
        faIcon =
            props.order === CoreTableConstants_1.SortOrder.desc
                ? faSortAmountDown_1.faSortAmountDown
                : faSortAmountUpAlt_1.faSortAmountUpAlt;
    return (react_1.default.createElement("span", { className: classnames_1.default({ "sort-icon": true, active: isActiveIcon }) },
        react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faIcon })));
}
exports.SortIcon = SortIcon;
//# sourceMappingURL=SortIcon.js.map