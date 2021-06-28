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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableList = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const timeago_js_1 = require("timeago.js");
const Link_1 = require("./Link");
const AdminAppContext_1 = require("./AdminAppContext");
let VariableRow = class VariableRow extends React.Component {
    render() {
        const { variable, searchHighlight } = this.props;
        return (React.createElement("tr", null,
            React.createElement("td", null,
                variable.isPrivate ? (React.createElement("span", { className: "text-secondary" }, "Unpublished: ")) : (""),
                React.createElement(Link_1.Link, { to: `/variables/${variable.id}` }, searchHighlight
                    ? searchHighlight(variable.name)
                    : variable.name)),
            variable.uploadedAt && (React.createElement("td", null,
                timeago_js_1.format(variable.uploadedAt),
                " by",
                " ",
                variable.uploadedBy
                    ? variable.uploadedBy
                    : "Bulk import"))));
    }
};
VariableRow.contextType = AdminAppContext_1.AdminAppContext;
VariableRow = __decorate([
    mobx_react_1.observer
], VariableRow);
let VariableList = class VariableList extends React.Component {
    render() {
        const { props } = this;
        return (React.createElement("table", { className: "table table-bordered" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Variable"),
                    props.variables.some((v) => v.uploadedAt !== undefined) && React.createElement("th", null, "Uploaded"))),
            React.createElement("tbody", null, props.variables.map((variable) => (React.createElement(VariableRow, { key: variable.id, variable: variable, searchHighlight: props.searchHighlight }))))));
    }
};
VariableList.contextType = AdminAppContext_1.AdminAppContext;
VariableList = __decorate([
    mobx_react_1.observer
], VariableList);
exports.VariableList = VariableList;
//# sourceMappingURL=VariableList.js.map