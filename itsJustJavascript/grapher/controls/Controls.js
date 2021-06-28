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
exports.FooterControls = exports.FilterSmallCountriesToggle = exports.ZoomToggle = exports.FacetYRangeToggle = exports.AbsRelToggle = exports.HighlightToggle = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const UrlUtils_1 = require("../../clientUtils/urls/UrlUtils");
const TimelineComponent_1 = require("../timeline/TimelineComponent");
const formatValue_1 = require("../../clientUtils/formatValue");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faDownload_1 = require("@fortawesome/free-solid-svg-icons/faDownload");
const faShareAlt_1 = require("@fortawesome/free-solid-svg-icons/faShareAlt");
const faExpand_1 = require("@fortawesome/free-solid-svg-icons/faExpand");
const faExternalLinkAlt_1 = require("@fortawesome/free-solid-svg-icons/faExternalLinkAlt");
const GrapherConstants_1 = require("../core/GrapherConstants");
const ShareMenu_1 = require("./ShareMenu");
// Todo: Add tests and stories
let HighlightToggle = class HighlightToggle extends React.Component {
    get manager() {
        return this.props.manager;
    }
    get highlight() {
        return this.props.manager.highlightToggle;
    }
    get highlightParams() {
        var _a;
        return UrlUtils_1.getQueryParams((((_a = this.highlight) === null || _a === void 0 ? void 0 : _a.paramStr) || "").substring(1));
    }
    onHighlightToggle(event) {
        var _a;
        if (!event.currentTarget.checked) {
            (_a = this.manager.selectionArray) === null || _a === void 0 ? void 0 : _a.clearSelection();
            return;
        }
        const params = Object.assign(Object.assign({}, UrlUtils_1.getWindowQueryParams()), this.highlightParams);
        this.manager.populateFromQueryParams(params);
    }
    get isHighlightActive() {
        const params = UrlUtils_1.getWindowQueryParams();
        let isActive = true;
        Object.keys(this.highlightParams).forEach((key) => {
            if (params[key] !== this.highlightParams[key])
                isActive = false;
        });
        return isActive;
    }
    render() {
        const { highlight, isHighlightActive } = this;
        return (React.createElement("label", { className: "clickable HighlightToggle" },
            React.createElement("input", { type: "checkbox", checked: isHighlightActive, onChange: this.onHighlightToggle }),
            " ",
            "\u00A0", highlight === null || highlight === void 0 ? void 0 :
            highlight.description));
    }
};
__decorate([
    mobx_1.computed
], HighlightToggle.prototype, "manager", null);
__decorate([
    mobx_1.computed
], HighlightToggle.prototype, "highlight", null);
__decorate([
    mobx_1.computed
], HighlightToggle.prototype, "highlightParams", null);
__decorate([
    mobx_1.action.bound
], HighlightToggle.prototype, "onHighlightToggle", null);
HighlightToggle = __decorate([
    mobx_react_1.observer
], HighlightToggle);
exports.HighlightToggle = HighlightToggle;
let AbsRelToggle = class AbsRelToggle extends React.Component {
    onToggle() {
        this.manager.stackMode = this.isRelativeMode
            ? GrapherConstants_1.StackMode.absolute
            : GrapherConstants_1.StackMode.relative;
    }
    get isRelativeMode() {
        return this.manager.stackMode === GrapherConstants_1.StackMode.relative;
    }
    get manager() {
        return this.props.manager;
    }
    render() {
        var _a;
        const label = (_a = this.manager.relativeToggleLabel) !== null && _a !== void 0 ? _a : "Relative";
        return (React.createElement("label", { className: "clickable" },
            React.createElement("input", { type: "checkbox", checked: this.isRelativeMode, onChange: this.onToggle, "data-track-note": "chart-abs-rel-toggle" }),
            " ",
            "\u00A0",
            label));
    }
};
__decorate([
    mobx_1.action.bound
], AbsRelToggle.prototype, "onToggle", null);
__decorate([
    mobx_1.computed
], AbsRelToggle.prototype, "isRelativeMode", null);
__decorate([
    mobx_1.computed
], AbsRelToggle.prototype, "manager", null);
AbsRelToggle = __decorate([
    mobx_react_1.observer
], AbsRelToggle);
exports.AbsRelToggle = AbsRelToggle;
let FacetYRangeToggle = class FacetYRangeToggle extends React.Component {
    onToggle() {
        this.props.manager.yAxis.facetAxisRange = this.isYRangeShared
            ? GrapherConstants_1.FacetAxisRange.independent
            : GrapherConstants_1.FacetAxisRange.shared;
    }
    get isYRangeShared() {
        return (this.props.manager.yAxis.facetAxisRange === GrapherConstants_1.FacetAxisRange.shared);
    }
    render() {
        return (React.createElement("label", { className: "clickable" },
            React.createElement("input", { type: "checkbox", checked: this.isYRangeShared, onChange: this.onToggle, "data-track-note": "chart-facet-yrange-toggle" }),
            " ",
            "\u00A0Uniform y-axis"));
    }
};
__decorate([
    mobx_1.action.bound
], FacetYRangeToggle.prototype, "onToggle", null);
__decorate([
    mobx_1.computed
], FacetYRangeToggle.prototype, "isYRangeShared", null);
FacetYRangeToggle = __decorate([
    mobx_react_1.observer
], FacetYRangeToggle);
exports.FacetYRangeToggle = FacetYRangeToggle;
let ZoomToggle = class ZoomToggle extends React.Component {
    onToggle() {
        this.props.manager.zoomToSelection = this.props.manager.zoomToSelection
            ? undefined
            : true;
    }
    render() {
        const label = "Zoom to selection";
        return (React.createElement("label", { className: "clickable" },
            React.createElement("input", { type: "checkbox", checked: this.props.manager.zoomToSelection, onChange: this.onToggle, "data-track-note": "chart-zoom-to-selection" }),
            " ",
            label));
    }
};
__decorate([
    mobx_1.action.bound
], ZoomToggle.prototype, "onToggle", null);
ZoomToggle = __decorate([
    mobx_react_1.observer
], ZoomToggle);
exports.ZoomToggle = ZoomToggle;
let FilterSmallCountriesToggle = class FilterSmallCountriesToggle extends React.Component {
    onChange() {
        this.manager.minPopulationFilter = this.manager.minPopulationFilter
            ? undefined
            : this.filterOption;
    }
    get manager() {
        return this.props.manager;
    }
    get filterOption() {
        var _a;
        return (_a = this.manager.populationFilterOption) !== null && _a !== void 0 ? _a : 1e6;
    }
    render() {
        const label = `Hide countries < ${formatValue_1.formatValue(this.filterOption, {})} people`;
        return (React.createElement("label", { className: "clickable" },
            React.createElement("input", { type: "checkbox", checked: !!this.manager.minPopulationFilter, onChange: this.onChange, "data-track-note": "chart-filter-small-countries" }),
            " ",
            "\u00A0",
            label));
    }
};
__decorate([
    mobx_1.action.bound
], FilterSmallCountriesToggle.prototype, "onChange", null);
__decorate([
    mobx_1.computed
], FilterSmallCountriesToggle.prototype, "manager", null);
__decorate([
    mobx_1.computed
], FilterSmallCountriesToggle.prototype, "filterOption", null);
FilterSmallCountriesToggle = __decorate([
    mobx_react_1.observer
], FilterSmallCountriesToggle);
exports.FilterSmallCountriesToggle = FilterSmallCountriesToggle;
let FooterControls = class FooterControls extends React.Component {
    get manager() {
        return this.props.manager;
    }
    onShareMenu() {
        this.manager.isShareMenuActive = !this.manager.isShareMenuActive;
    }
    get availableTabs() {
        return this.manager.availableTabs || [];
    }
    _getTabsElement() {
        const { manager } = this;
        return (React.createElement("nav", { className: "tabs" },
            React.createElement("ul", null,
                this.availableTabs.map((tabName) => {
                    return tabName !== GrapherConstants_1.GrapherTabOption.download ? (React.createElement("li", { key: tabName, className: "tab clickable" +
                            (tabName === manager.currentTab
                                ? " active"
                                : "") },
                        React.createElement("a", { onClick: () => {
                                manager.currentTab = tabName;
                            }, "data-track-note": "chart-click-" + tabName }, tabName))) : null;
                }),
                React.createElement("li", { className: "tab clickable icon download-tab-button" +
                        (manager.currentTab === GrapherConstants_1.GrapherTabOption.download
                            ? " active"
                            : ""), title: "Download as .png or .svg" },
                    React.createElement("a", { "data-track-note": "chart-click-download", onClick: () => (manager.currentTab = GrapherConstants_1.GrapherTabOption.download) },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload }),
                        " Download")),
                React.createElement("li", { className: "clickable icon" },
                    React.createElement("a", { title: "Share", onClick: this.onShareMenu, "data-track-note": "chart-click-share" },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faShareAlt_1.faShareAlt }))),
                manager.isInIFrame && (React.createElement("li", { className: "clickable icon" },
                    React.createElement("a", { title: "Open chart in new tab", href: manager.canonicalUrl, "data-track-note": "chart-click-newtab", target: "_blank", rel: "noopener" },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExpand_1.faExpand })))))));
    }
    render() {
        var _a;
        const { manager } = this;
        const { isShareMenuActive, hasRelatedQuestion, relatedQuestions, } = manager;
        const tabsElement = (React.createElement("div", { className: "footerRowSingle" }, this._getTabsElement()));
        const shareMenuElement = isShareMenuActive && (React.createElement(ShareMenu_1.ShareMenu, { manager: manager, onDismiss: this.onShareMenu }));
        const relatedQuestionElement = relatedQuestions && hasRelatedQuestion && (React.createElement("div", { className: "relatedQuestion" },
            "Related:\u00A0",
            React.createElement("a", { href: relatedQuestions[0].url, target: "_blank", rel: "noopener", "data-track-note": "chart-click-related" },
                relatedQuestions[0].text,
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExternalLinkAlt_1.faExternalLinkAlt }))));
        const timeline = !manager.hasTimeline ? null : (React.createElement("div", { className: "footerRowSingle" },
            React.createElement(TimelineComponent_1.TimelineComponent, { timelineController: this.manager.timelineController })));
        return (React.createElement("div", { className: "ControlsFooter", style: { height: (_a = manager.footerControlsHeight) !== null && _a !== void 0 ? _a : 1 } },
            timeline,
            tabsElement,
            shareMenuElement,
            relatedQuestionElement));
    }
};
__decorate([
    mobx_1.computed
], FooterControls.prototype, "manager", null);
__decorate([
    mobx_1.action.bound
], FooterControls.prototype, "onShareMenu", null);
__decorate([
    mobx_1.computed
], FooterControls.prototype, "availableTabs", null);
FooterControls = __decorate([
    mobx_react_1.observer
], FooterControls);
exports.FooterControls = FooterControls;
//# sourceMappingURL=Controls.js.map