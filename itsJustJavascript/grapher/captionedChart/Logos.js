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
exports.Logo = exports.LogoOption = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const LogosSVG_1 = require("./LogosSVG");
var LogoOption;
(function (LogoOption) {
    LogoOption["owid"] = "owid";
    LogoOption["core+owid"] = "core+owid";
    LogoOption["gv+owid"] = "gv+owid";
})(LogoOption = exports.LogoOption || (exports.LogoOption = {}));
const logos = {
    owid: {
        svg: LogosSVG_1.OWID_LOGO_SVG,
        width: 210,
        height: 120,
        targetHeight: 35,
        url: "https://ourworldindata.org",
    },
    "core+owid": {
        svg: LogosSVG_1.CORE_LOGO_SVG,
        width: 102,
        height: 37,
        targetHeight: 35,
    },
    "gv+owid": {
        svg: LogosSVG_1.GV_LOGO_SVG,
        width: 420,
        height: 350,
        targetHeight: 52,
    },
};
class Logo {
    constructor(props) {
        this.props = props;
    }
    get spec() {
        return this.props.logo !== undefined
            ? logos[this.props.logo]
            : logos.owid;
    }
    get scale() {
        return this.spec.targetHeight / this.spec.height;
    }
    get width() {
        return this.spec.width * this.scale;
    }
    get height() {
        return this.spec.height * this.scale;
    }
    renderSVG(targetX, targetY) {
        const { scale } = this;
        const svg = (this.spec.svg.match(/<svg>(.*)<\/svg>/) || "")[1] || this.spec.svg;
        return (React.createElement("g", { transform: `translate(${Math.round(targetX)}, ${targetY}) scale(${parseFloat(scale.toFixed(2))})`, dangerouslySetInnerHTML: { __html: svg } }));
    }
    renderHTML() {
        const { spec } = this;
        const props = {
            className: "logo",
            dangerouslySetInnerHTML: { __html: spec.svg },
            style: { height: `${spec.targetHeight}px` },
        };
        if (this.props.isLink || !spec.url)
            return React.createElement("div", Object.assign({}, props));
        return React.createElement("a", Object.assign({}, props, { href: spec.url, target: "_blank", rel: "noopener" }));
    }
}
__decorate([
    mobx_1.computed
], Logo.prototype, "spec", null);
__decorate([
    mobx_1.computed
], Logo.prototype, "scale", null);
__decorate([
    mobx_1.computed
], Logo.prototype, "width", null);
__decorate([
    mobx_1.computed
], Logo.prototype, "height", null);
exports.Logo = Logo;
//# sourceMappingURL=Logos.js.map