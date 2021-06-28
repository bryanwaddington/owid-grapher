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
exports.WithAddDataButtons = void 0;
const React = __importStar(require("react"));
const NoDataModal_1 = require("./NoDataModal");
exports.default = {
    title: "NoDataModal",
    component: NoDataModal_1.NoDataModal,
};
const WithAddDataButtons = () => {
    return (React.createElement("div", { className: "chart", style: { width: 640, height: 480 } },
        React.createElement("svg", null,
            React.createElement(NoDataModal_1.NoDataModal, { message: "You have no data, but this is only a test", manager: {
                    canChangeEntity: true,
                    canAddData: true,
                    isSelectingData: false,
                    entityType: "Country",
                } }))));
};
exports.WithAddDataButtons = WithAddDataButtons;
//# sourceMappingURL=NoDataModal.stories.js.map