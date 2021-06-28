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
exports.collapsibleListSampleItems = void 0;
const react_1 = __importDefault(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Util_1 = require("../../../clientUtils/Util");
let SampleCheckBox = class SampleCheckBox extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.checked = false;
    }
    onToggle() {
        this.checked = !this.checked;
    }
    render() {
        return (react_1.default.createElement("label", { className: "clickable" },
            react_1.default.createElement("input", { type: "checkbox", checked: this.checked, onChange: this.onToggle }),
            ` checkbox ${this.props.id}`));
    }
};
__decorate([
    mobx_1.observable
], SampleCheckBox.prototype, "checked", void 0);
__decorate([
    mobx_1.action.bound
], SampleCheckBox.prototype, "onToggle", null);
SampleCheckBox = __decorate([
    mobx_react_1.observer
], SampleCheckBox);
exports.collapsibleListSampleItems = Util_1.range(0, 12).map((i) => (react_1.default.createElement(SampleCheckBox, { key: i, id: i })));
//# sourceMappingURL=CollapsibleList.sampleInput.js.map