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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const url_parse_1 = __importDefault(require("url-parse"));
const TextWrap_1 = require("../text/TextWrap");
const Bounds_1 = require("../../clientUtils/Bounds");
const Util_1 = require("../../clientUtils/Util");
const Tooltip_1 = require("../tooltip/Tooltip");
const GrapherConstants_1 = require("../core/GrapherConstants");
let Footer = class Footer extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    get maxWidth() {
        var _a;
        return (_a = this.props.maxWidth) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS.width;
    }
    get manager() {
        return this.props.manager;
    }
    get sourcesText() {
        const sourcesLine = this.manager.sourcesLine;
        return sourcesLine ? `Source: ${sourcesLine}` : "";
    }
    get noteText() {
        return this.manager.note ? `Note: ${this.manager.note}` : "";
    }
    get ccSvg() {
        if (this.manager.hasOWIDLogo)
            return `<a style="fill: #777;" class="cclogo" href="http://creativecommons.org/licenses/by/4.0/deed.en_US" target="_blank">CC BY</a>`;
        return `<a href="https://ourworldindata.org" target="_blank">Powered by ourworldindata.org</a>`;
    }
    get originUrlWithProtocol() {
        var _a;
        return (_a = this.manager.originUrlWithProtocol) !== null && _a !== void 0 ? _a : "http://localhost";
    }
    get finalUrl() {
        const originUrl = this.originUrlWithProtocol;
        const url = url_parse_1.default(originUrl);
        return `https://${url.hostname}${url.pathname}`;
    }
    get finalUrlText() {
        const originUrl = this.originUrlWithProtocol;
        // Make sure the link back to OWID is consistent
        // And don't show the full url if there isn't enough room
        if (!originUrl ||
            !originUrl.toLowerCase().match(/^https?:\/\/./) ||
            this.manager.shouldLinkToOwid)
            return undefined;
        const url = url_parse_1.default(originUrl);
        const finalUrlText = `${url.hostname}${url.pathname}`.replace("ourworldindata.org", "OurWorldInData.org");
        if (Bounds_1.Bounds.forText(finalUrlText, { fontSize: this.fontSize }).width >
            0.7 * this.maxWidth)
            return undefined;
        return finalUrlText;
    }
    get licenseSvg() {
        const { finalUrl, finalUrlText, ccSvg } = this;
        if (!finalUrlText)
            return ccSvg;
        return `*data-entry* • ${ccSvg}`.replace(/\*data-entry\*/, "<a target='_blank' style='fill: #777;' href='" +
            finalUrl +
            "'>" +
            finalUrlText +
            "</a>");
    }
    get fontSize() {
        var _a;
        return 0.7 * ((_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE);
    }
    get sources() {
        const { maxWidth, fontSize, sourcesText } = this;
        return new TextWrap_1.TextWrap({
            maxWidth,
            fontSize,
            text: sourcesText,
            linkifyText: true,
        });
    }
    get note() {
        const { maxWidth, fontSize, noteText } = this;
        return new TextWrap_1.TextWrap({
            maxWidth,
            fontSize,
            text: noteText,
            linkifyText: true,
        });
    }
    get license() {
        const { maxWidth, fontSize, licenseSvg } = this;
        return new TextWrap_1.TextWrap({
            maxWidth: maxWidth * 3,
            fontSize,
            text: licenseSvg,
            rawHtml: true,
        });
    }
    // Put the license stuff to the side if there's room
    get isCompact() {
        return this.maxWidth - this.sources.width - 5 > this.license.width;
    }
    get paraMargin() {
        return 2;
    }
    get height() {
        if (this.manager.isMediaCard)
            return 0;
        const { sources, note, license, isCompact, paraMargin } = this;
        return (sources.height +
            (note.height ? paraMargin + note.height : 0) +
            (isCompact ? 0 : paraMargin + license.height));
    }
    onSourcesClick() {
        this.manager.currentTab = GrapherConstants_1.GrapherTabOption.sources;
    }
    renderStatic(targetX, targetY) {
        if (this.manager.isMediaCard)
            return null;
        const { sources, note, license, maxWidth, isCompact, paraMargin } = this;
        return (React.createElement("g", { className: "SourcesFooter", style: { fill: "#777" } },
            React.createElement("g", { style: { fill: "#777" } }, sources.render(targetX, targetY)),
            note.render(targetX, targetY + sources.height + paraMargin),
            isCompact
                ? license.render(targetX + maxWidth - license.width, targetY)
                : license.render(targetX, targetY +
                    sources.height +
                    paraMargin +
                    (note.height ? note.height + paraMargin : 0))));
    }
    onMouseMove(e) {
        const cc = this.base.current.querySelector(".cclogo");
        if (cc && cc.matches(":hover")) {
            const div = this.base.current;
            const mouse = Util_1.getRelativeMouse(div.closest(".GrapherComponent"), e);
            this.tooltipTarget = { x: mouse.x, y: mouse.y };
        }
        else
            this.tooltipTarget = undefined;
    }
    componentDidMount() {
        window.addEventListener("mousemove", this.onMouseMove);
    }
    componentWillUnmount() {
        window.removeEventListener("mousemove", this.onMouseMove);
    }
    render() {
        const { tooltipTarget } = this;
        const license = (React.createElement("div", { className: "license", style: {
                fontSize: this.license.fontSize,
                lineHeight: this.sources.lineHeight,
            } },
            this.finalUrlText && (React.createElement("a", { href: this.finalUrl, target: "_blank", rel: "noopener" },
                this.finalUrlText,
                " \u2022",
                " ")),
            this.manager.hasOWIDLogo ? (React.createElement("a", { className: "cclogo", href: "http://creativecommons.org/licenses/by/4.0/deed.en_US", target: "_blank", rel: "noopener" }, "CC BY")) : (React.createElement("a", { href: "https://ourworldindata.org", target: "_blank", rel: "noopener" }, "Powered by ourworldindata.org"))));
        return (React.createElement("footer", { className: "SourcesFooterHTML" + (this.isCompact ? " compact" : ""), ref: this.base, style: { color: "#777" } },
            this.isCompact && license,
            React.createElement("p", { style: this.sources.htmlStyle, className: "clickable", onClick: this.onSourcesClick }, this.sources.renderHTML()),
            this.note && (React.createElement("p", { style: this.note.htmlStyle }, this.note.renderHTML())),
            !this.isCompact && license,
            tooltipTarget && (React.createElement(Tooltip_1.Tooltip, { tooltipManager: this.manager, x: tooltipTarget.x, y: tooltipTarget.y, style: {
                    textAlign: "center",
                    maxWidth: "300px",
                    whiteSpace: "inherit",
                    padding: "10px",
                    fontSize: "0.8em",
                } },
                React.createElement("p", null, "Our World in Data charts are licensed under Creative Commons; you are free to use, share, and adapt this material. Click through to the CC BY page for more information. Please bear in mind that the underlying source data for all our charts might be subject to different license terms from third-party authors.")))));
    }
};
__decorate([
    mobx_1.computed
], Footer.prototype, "maxWidth", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "manager", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "sourcesText", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "noteText", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "ccSvg", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "originUrlWithProtocol", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "finalUrl", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "finalUrlText", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "licenseSvg", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "sources", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "note", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "license", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "isCompact", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "paraMargin", null);
__decorate([
    mobx_1.computed
], Footer.prototype, "height", null);
__decorate([
    mobx_1.action.bound
], Footer.prototype, "onSourcesClick", null);
__decorate([
    mobx_1.observable.ref
], Footer.prototype, "tooltipTarget", void 0);
__decorate([
    mobx_1.action.bound
], Footer.prototype, "onMouseMove", null);
Footer = __decorate([
    mobx_react_1.observer
], Footer);
exports.Footer = Footer;
//# sourceMappingURL=Footer.js.map