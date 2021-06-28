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
exports.Header = void 0;
const React = __importStar(require("react"));
const TextWrap_1 = require("../text/TextWrap");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Logos_1 = require("../captionedChart/Logos");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Bounds_1 = require("../../clientUtils/Bounds");
let Header = class Header extends React.Component {
    constructor() {
        super(...arguments);
        this.titleMarginBottom = 4;
    }
    get manager() {
        return this.props.manager;
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get maxWidth() {
        var _a;
        return (_a = this.props.maxWidth) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS.width;
    }
    get titleText() {
        var _a;
        return (_a = this.manager.currentTitle) !== null && _a !== void 0 ? _a : "";
    }
    get subtitleText() {
        var _a;
        return (_a = this.manager.subtitle) !== null && _a !== void 0 ? _a : "";
    }
    get logo() {
        const { manager } = this;
        if (manager.hideLogo)
            return undefined;
        return new Logos_1.Logo({
            logo: manager.logo,
            isLink: !!manager.shouldLinkToOwid,
            fontSize: this.fontSize,
        });
    }
    get logoWidth() {
        return this.logo ? this.logo.width : 0;
    }
    get logoHeight() {
        return this.logo ? this.logo.height : 0;
    }
    get title() {
        const { logoWidth } = this;
        const maxWidth = this.maxWidth - logoWidth - 20;
        // Try to fit the title into a single line if possible-- but not if it would make the text super small
        let title;
        let fontScale = 1.4;
        while (true) {
            title = new TextWrap_1.TextWrap({
                maxWidth,
                fontSize: fontScale * this.fontSize,
                text: this.titleText,
                lineHeight: 1,
            });
            if (fontScale <= 1.2 || title.lines.length <= 1)
                break;
            fontScale -= 0.05;
        }
        return new TextWrap_1.TextWrap({
            maxWidth,
            fontSize: fontScale * this.fontSize,
            text: this.titleText,
            lineHeight: 1,
        });
    }
    get subtitleWidth() {
        // If the subtitle is entirely below the logo, we can go underneath it
        return this.title.height > this.logoHeight
            ? this.maxWidth
            : this.maxWidth - this.logoWidth - 10;
    }
    get subtitle() {
        return new TextWrap_1.TextWrap({
            maxWidth: this.subtitleWidth,
            fontSize: 0.8 * this.fontSize,
            text: this.subtitleText,
            lineHeight: 1.2,
            linkifyText: true,
        });
    }
    get height() {
        if (this.manager.isMediaCard)
            return 0;
        return Math.max(this.title.height + this.subtitle.height + this.titleMarginBottom, this.logoHeight);
    }
    renderStatic(x, y) {
        const { title, logo, subtitle, manager, maxWidth } = this;
        if (manager.isMediaCard)
            return null;
        return (React.createElement("g", { className: "HeaderView" },
            logo &&
                logo.height > 0 &&
                logo.renderSVG(x + maxWidth - logo.width, y),
            React.createElement("a", { href: manager.canonicalUrl, style: {
                    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                }, target: "_blank", rel: "noopener" }, title.render(x, y, { fill: "#555" })),
            subtitle.render(x, y + title.height + this.titleMarginBottom, {
                fill: "#666",
            })));
    }
    render() {
        const { manager } = this;
        const titleStyle = Object.assign(Object.assign({}, this.title.htmlStyle), { marginBottom: this.titleMarginBottom });
        const subtitleStyle = Object.assign(Object.assign({}, this.subtitle.htmlStyle), { 
            // make sure there are no scrollbars on subtitle
            overflowY: "hidden" });
        return (React.createElement("div", { className: "HeaderHTML" },
            this.logo && this.logo.renderHTML(),
            React.createElement("a", { href: manager.canonicalUrl, target: "_blank" },
                React.createElement("h1", { style: titleStyle }, this.title.renderHTML())),
            React.createElement("p", { style: subtitleStyle }, this.subtitle.renderHTML())));
    }
};
__decorate([
    mobx_1.computed
], Header.prototype, "manager", null);
__decorate([
    mobx_1.computed
], Header.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], Header.prototype, "maxWidth", null);
__decorate([
    mobx_1.computed
], Header.prototype, "titleText", null);
__decorate([
    mobx_1.computed
], Header.prototype, "subtitleText", null);
__decorate([
    mobx_1.computed
], Header.prototype, "logo", null);
__decorate([
    mobx_1.computed
], Header.prototype, "logoWidth", null);
__decorate([
    mobx_1.computed
], Header.prototype, "logoHeight", null);
__decorate([
    mobx_1.computed
], Header.prototype, "title", null);
__decorate([
    mobx_1.computed
], Header.prototype, "subtitleWidth", null);
__decorate([
    mobx_1.computed
], Header.prototype, "subtitle", null);
__decorate([
    mobx_1.computed
], Header.prototype, "height", null);
Header = __decorate([
    mobx_react_1.observer
], Header);
exports.Header = Header;
//# sourceMappingURL=Header.js.map