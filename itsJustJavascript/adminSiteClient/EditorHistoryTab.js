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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorHistoryTab = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const Forms_1 = require("./Forms");
const mobx_1 = require("mobx");
const timeago_js_1 = require("timeago.js");
let LogRenderer = class LogRenderer extends React.Component {
    get prettyConfig() {
        const { log } = this.props;
        return JSON.stringify(JSON.parse(log.config), undefined, 2);
    }
    get title() {
        const { log } = this.props;
        const user = log.userName || log.userId.toString();
        return `Saved ${timeago_js_1.format(log.createdAt)} by ${user}`;
    }
    get timestamp() {
        return timeago_js_1.format(this.props.log.createdAt);
    }
    render() {
        const { log } = this.props;
        const { title } = this;
        return (React.createElement("li", { className: "list-group-item d-flex justify-content-between" },
            React.createElement("span", null, title),
            React.createElement("button", { className: "align-self-end btn btn-danger", onClick: () => this.props.applyConfig(log.config) }, "Restore")));
    }
};
__decorate([
    mobx_1.computed
], LogRenderer.prototype, "prettyConfig", null);
__decorate([
    mobx_1.computed
], LogRenderer.prototype, "title", null);
__decorate([
    mobx_1.computed
], LogRenderer.prototype, "timestamp", null);
LogRenderer = __decorate([
    mobx_react_1.observer
], LogRenderer);
let EditorHistoryTab = class EditorHistoryTab extends React.Component {
    get logs() {
        return this.props.editor.logs || [];
    }
    applyConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const { grapher } = this.props.editor;
            const configJson = JSON.parse(config);
            grapher.updateFromObject(configJson);
            grapher.updateAuthoredVersion(Object.assign(Object.assign({}, grapher.toObject()), { selectedData: configJson.selectedData, data: configJson.data }));
            grapher.rebuildInputOwidTable();
        });
    }
    render() {
        // Avoid modifying the original JSON object
        // Due to mobx memoizing computed values, the JSON can be mutated.
        const chartConfigObject = Object.assign({}, this.props.editor.grapher.object);
        return (React.createElement("div", null,
            this.logs.map((log, i) => (React.createElement("ul", { key: i, className: "list-group" },
                React.createElement(LogRenderer, { log: log, applyConfig: this.applyConfig })))),
            React.createElement(Forms_1.Section, { name: "Debug Version" },
                React.createElement("textarea", { rows: 7, readOnly: true, className: "form-control", value: JSON.stringify(chartConfigObject, undefined, 2) }))));
    }
};
__decorate([
    mobx_1.computed
], EditorHistoryTab.prototype, "logs", null);
__decorate([
    mobx_1.action.bound
], EditorHistoryTab.prototype, "applyConfig", null);
EditorHistoryTab = __decorate([
    mobx_react_1.observer
], EditorHistoryTab);
exports.EditorHistoryTab = EditorHistoryTab;
//# sourceMappingURL=EditorHistoryTab.js.map