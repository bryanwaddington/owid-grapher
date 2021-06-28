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
exports.renderProminentLink = exports.PROMINENT_LINK_CLASSNAME = void 0;
const React = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const EntityUrlBuilder_1 = require("../../grapher/core/EntityUrlBuilder");
const Url_1 = require("../../clientUtils/urls/Url");
exports.PROMINENT_LINK_CLASSNAME = "wp-block-owid-prominent-link";
let ProminentLink = class ProminentLink extends React.Component {
    get originalUrl() {
        return EntityUrlBuilder_1.migrateSelectedEntityNamesParam(Url_1.Url.fromURL(this.props.originalAnchorAttributes.href));
    }
    get originalSelectedEntities() {
        var _a;
        return (_a = EntityUrlBuilder_1.getSelectedEntityNamesParam(this.originalUrl)) !== null && _a !== void 0 ? _a : [];
    }
    get entitiesInGlobalEntitySelection() {
        var _a, _b;
        return (_b = (_a = this.props.globalEntitySelection) === null || _a === void 0 ? void 0 : _a.selectedEntityNames) !== null && _b !== void 0 ? _b : [];
    }
    get updatedUrl() {
        const newEntityList = Util_1.union(this.originalSelectedEntities, this.entitiesInGlobalEntitySelection);
        return EntityUrlBuilder_1.setSelectedEntityNamesParam(this.originalUrl, newEntityList);
    }
    render() {
        var _a;
        return (React.createElement("a", Object.assign({ dangerouslySetInnerHTML: { __html: (_a = this.props.innerHTML) !== null && _a !== void 0 ? _a : "" } }, this.props.originalAnchorAttributes, { href: this.updatedUrl.fullUrl })));
    }
};
__decorate([
    mobx_1.computed
], ProminentLink.prototype, "originalUrl", null);
__decorate([
    mobx_1.computed
], ProminentLink.prototype, "originalSelectedEntities", null);
__decorate([
    mobx_1.computed
], ProminentLink.prototype, "entitiesInGlobalEntitySelection", null);
__decorate([
    mobx_1.computed
], ProminentLink.prototype, "updatedUrl", null);
ProminentLink = __decorate([
    mobx_react_1.observer
], ProminentLink);
const renderProminentLink = (globalEntitySelection) => document
    .querySelectorAll(`.${exports.PROMINENT_LINK_CLASSNAME}`)
    .forEach((el) => {
    const anchorTag = el.querySelector("a");
    if (!anchorTag)
        return;
    const rendered = (React.createElement(ProminentLink, { originalAnchorAttributes: Util_1.getAttributesOfHTMLElement(anchorTag), innerHTML: anchorTag.innerHTML, globalEntitySelection: globalEntitySelection }));
    react_dom_1.default.render(rendered, el);
});
exports.renderProminentLink = renderProminentLink;
//# sourceMappingURL=ProminentLink.js.map