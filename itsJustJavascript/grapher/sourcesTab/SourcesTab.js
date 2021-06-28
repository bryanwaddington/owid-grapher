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
exports.SourcesTab = void 0;
const Util_1 = require("../../clientUtils/Util");
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const faPencilAlt_1 = require("@fortawesome/free-solid-svg-icons/faPencilAlt");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const formatText = (s) => Util_1.linkify(s).replace(/(?:\r\n|\r|\n)/g, "<br/>");
let SourcesTab = class SourcesTab extends React.Component {
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get manager() {
        return this.props.manager;
    }
    renderSource(column) {
        var _a, _b;
        const { table, slug, source, def } = column;
        const { datasetId, coverage } = def;
        const editUrl = this.manager.showAdminControls
            ? `${this.props.manager.adminBaseUrl}/admin/datasets/${datasetId}`
            : undefined;
        const { minTime, maxTime } = column;
        let timespan = "";
        if (minTime !== undefined && maxTime !== undefined)
            timespan = `${(_a = table.timeColumn) === null || _a === void 0 ? void 0 : _a.formatValue(minTime)} – ${(_b = table.timeColumn) === null || _b === void 0 ? void 0 : _b.formatValue(maxTime)}`;
        return (React.createElement("div", { key: slug, className: "datasource-wrapper" },
            React.createElement("h2", null,
                column.name,
                " ",
                editUrl && (React.createElement("a", { href: editUrl, target: "_blank", rel: "noopener" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPencilAlt_1.faPencilAlt })))),
            React.createElement("table", { className: "variable-desc" },
                React.createElement("tbody", null,
                    column.description ? (React.createElement("tr", null,
                        React.createElement("td", null, "Variable description"),
                        React.createElement("td", { dangerouslySetInnerHTML: {
                                __html: formatText(column.description),
                            } }))) : null,
                    coverage ? (React.createElement("tr", null,
                        React.createElement("td", null, "Variable geographic coverage"),
                        React.createElement("td", null, coverage))) : null,
                    timespan ? (React.createElement("tr", null,
                        React.createElement("td", null, "Variable time span"),
                        React.createElement("td", null, timespan))) : null,
                    column.unitConversionFactor !== 1 ? (React.createElement("tr", null,
                        React.createElement("td", null, "Unit conversion factor for chart"),
                        React.createElement("td", null, column.unitConversionFactor))) : null,
                    source.dataPublishedBy ? (React.createElement("tr", null,
                        React.createElement("td", null, "Data published by"),
                        React.createElement("td", { dangerouslySetInnerHTML: {
                                __html: formatText(source.dataPublishedBy),
                            } }))) : null,
                    source.dataPublisherSource ? (React.createElement("tr", null,
                        React.createElement("td", null, "Data publisher's source"),
                        React.createElement("td", { dangerouslySetInnerHTML: {
                                __html: formatText(source.dataPublisherSource),
                            } }))) : null,
                    source.link ? (React.createElement("tr", null,
                        React.createElement("td", null, "Link"),
                        React.createElement("td", { dangerouslySetInnerHTML: {
                                __html: formatText(source.link),
                            } }))) : null,
                    source.retrievedDate ? (React.createElement("tr", null,
                        React.createElement("td", null, "Retrieved"),
                        React.createElement("td", null, source.retrievedDate))) : null)),
            source.additionalInfo && (React.createElement("p", { dangerouslySetInnerHTML: {
                    __html: formatText(source.additionalInfo),
                } }))));
    }
    render() {
        const { bounds } = this;
        const cols = this.manager.columnsWithSources.filter((col) => col.source);
        return (React.createElement("div", { className: "sourcesTab", style: Object.assign(Object.assign({}, bounds.toCSS()), { position: "absolute" }) },
            React.createElement("div", null,
                React.createElement("h2", null, "Sources"),
                React.createElement("div", null, cols.map((col) => this.renderSource(col))))));
    }
};
__decorate([
    mobx_1.computed
], SourcesTab.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], SourcesTab.prototype, "manager", null);
SourcesTab = __decorate([
    mobx_react_1.observer
], SourcesTab);
exports.SourcesTab = SourcesTab;
//# sourceMappingURL=SourcesTab.js.map