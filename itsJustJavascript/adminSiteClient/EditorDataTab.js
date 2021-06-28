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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorDataTab = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Forms_1 = require("./Forms");
const faArrowsAltV_1 = require("@fortawesome/free-solid-svg-icons/faArrowsAltV");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
let EntityItem = class EntityItem extends React.Component {
    constructor() {
        super(...arguments);
        this.isChoosingColor = false;
    }
    get table() {
        return this.props.grapher.table;
    }
    get color() {
        return this.table.getColorForEntityName(this.props.entityName);
    }
    onColor(color) {
        if (!color)
            return;
        const { grapher } = this.props;
        grapher.selectedEntityColors[this.props.entityName] = color;
        grapher.legacyConfigAsAuthored.selectedEntityColors = Object.assign(Object.assign({}, grapher.legacyConfigAsAuthored.selectedEntityColors), { [this.props.entityName]: color });
        grapher.rebuildInputOwidTable();
    }
    onRemove() {
        var _a, _b;
        (_b = (_a = this.props).onRemove) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    render() {
        const { props, color } = this;
        const { entityName, onRemove } = props, rest = __rest(props, ["entityName", "onRemove"]);
        return (React.createElement(Forms_1.EditableListItem, Object.assign({ className: "EditableListItem", key: entityName }, rest),
            React.createElement("div", null,
                React.createElement("div", null,
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faArrowsAltV_1.faArrowsAltV })),
                React.createElement(Forms_1.ColorBox, { color: color, onColor: this.onColor }),
                entityName),
            React.createElement("div", { className: "clickable", onClick: this.onRemove },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes }))));
    }
};
__decorate([
    mobx_1.observable.ref
], EntityItem.prototype, "isChoosingColor", void 0);
__decorate([
    mobx_1.computed
], EntityItem.prototype, "table", null);
__decorate([
    mobx_1.computed
], EntityItem.prototype, "color", null);
__decorate([
    mobx_1.action.bound
], EntityItem.prototype, "onColor", null);
__decorate([
    mobx_1.action.bound
], EntityItem.prototype, "onRemove", null);
EntityItem = __decorate([
    mobx_react_1.observer
], EntityItem);
let KeysSection = class KeysSection extends React.Component {
    onAddKey(entityName) {
        this.props.grapher.selection.selectEntity(entityName);
    }
    onStartDrag(key) {
        this.dragKey = key;
        const onDrag = mobx_1.action(() => {
            this.dragKey = undefined;
            window.removeEventListener("mouseup", onDrag);
        });
        window.addEventListener("mouseup", onDrag);
    }
    onMouseEnter(targetKey) {
        if (!this.dragKey || targetKey === this.dragKey)
            return;
        const selectedKeys = Util_1.clone(this.props.grapher.selection.selectedEntityNames);
        const dragIndex = selectedKeys.indexOf(this.dragKey);
        const targetIndex = selectedKeys.indexOf(targetKey);
        selectedKeys.splice(dragIndex, 1);
        selectedKeys.splice(targetIndex, 0, this.dragKey);
        this.props.grapher.selection.setSelectedEntities(selectedKeys);
    }
    render() {
        const { grapher } = this.props;
        const { selection } = grapher;
        const { unselectedEntityNames, selectedEntityNames } = selection;
        return (React.createElement(Forms_1.Section, { name: "Data to show" },
            React.createElement(Forms_1.SelectField, { onValue: this.onAddKey, value: "Select data", options: ["Select data"].concat(unselectedEntityNames), optionLabels: ["Select data"].concat(unselectedEntityNames) }),
            React.createElement(Forms_1.EditableList, null, selectedEntityNames.map((entityName) => (React.createElement(EntityItem, { key: entityName, grapher: grapher, entityName: entityName, onRemove: () => selection.deselectEntity(entityName), onMouseDown: () => this.onStartDrag(entityName), onMouseEnter: () => this.onMouseEnter(entityName) }))))));
    }
};
__decorate([
    mobx_1.observable.ref
], KeysSection.prototype, "dragKey", void 0);
__decorate([
    mobx_1.action.bound
], KeysSection.prototype, "onAddKey", null);
__decorate([
    mobx_1.action.bound
], KeysSection.prototype, "onStartDrag", null);
__decorate([
    mobx_1.action.bound
], KeysSection.prototype, "onMouseEnter", null);
KeysSection = __decorate([
    mobx_react_1.observer
], KeysSection);
let EditorDataTab = class EditorDataTab extends React.Component {
    render() {
        const { editor } = this.props;
        const { grapher } = editor;
        return (React.createElement("div", { className: "EditorDataTab" },
            React.createElement(Forms_1.Section, { name: "Can user add/change data?" },
                React.createElement("div", { className: "form-check" },
                    React.createElement("label", { className: "form-check-label" },
                        React.createElement("input", { className: "form-check-input", type: "radio", name: "add-country-mode", value: GrapherConstants_1.EntitySelectionMode.MultipleEntities, checked: grapher.addCountryMode ===
                                GrapherConstants_1.EntitySelectionMode.MultipleEntities, onChange: () => (grapher.addCountryMode =
                                GrapherConstants_1.EntitySelectionMode.MultipleEntities) }),
                        "User can add and remove data")),
                React.createElement("div", { className: "form-check" },
                    React.createElement("label", { className: "form-check-label" },
                        React.createElement("input", { className: "form-check-input", type: "radio", name: "add-country-mode", value: GrapherConstants_1.EntitySelectionMode.SingleEntity, checked: grapher.addCountryMode ===
                                GrapherConstants_1.EntitySelectionMode.SingleEntity, onChange: () => (grapher.addCountryMode =
                                GrapherConstants_1.EntitySelectionMode.SingleEntity) }),
                        "User can change entity")),
                React.createElement("div", { className: "form-check" },
                    React.createElement("label", { className: "form-check-label" },
                        React.createElement("input", { className: "form-check-input", type: "radio", name: "add-country-mode", value: GrapherConstants_1.EntitySelectionMode.Disabled, checked: grapher.addCountryMode ===
                                GrapherConstants_1.EntitySelectionMode.Disabled, onChange: () => (grapher.addCountryMode =
                                GrapherConstants_1.EntitySelectionMode.Disabled) }),
                        "User cannot change/add data"))),
            React.createElement(KeysSection, { grapher: editor.grapher })));
    }
};
EditorDataTab = __decorate([
    mobx_react_1.observer
], EditorDataTab);
exports.EditorDataTab = EditorDataTab;
//# sourceMappingURL=EditorDataTab.js.map