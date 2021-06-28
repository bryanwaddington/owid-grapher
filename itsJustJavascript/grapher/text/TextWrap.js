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
exports.TextWrap = void 0;
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const Bounds_1 = require("../../clientUtils/Bounds");
const React = __importStar(require("react"));
function startsWithNewline(text) {
    return /^\n/.test(text);
}
class TextWrap {
    constructor(props) {
        this.props = props;
    }
    get maxWidth() {
        var _a;
        return (_a = this.props.maxWidth) !== null && _a !== void 0 ? _a : Infinity;
    }
    get lineHeight() {
        var _a;
        return (_a = this.props.lineHeight) !== null && _a !== void 0 ? _a : 1.1;
    }
    get fontSize() {
        var _a;
        return (_a = this.props.fontSize) !== null && _a !== void 0 ? _a : 1;
    }
    get fontWeight() {
        return this.props.fontWeight;
    }
    get text() {
        return this.props.text;
    }
    get lines() {
        const { text, maxWidth, fontSize, fontWeight } = this;
        const words = Util_1.isEmpty(text)
            ? []
            : // We prepend spaces to newlines in order to be able to do a "starts with"
                // check to trigger a new line.
                text.replace(/\n/g, " \n").split(" ");
        const lines = [];
        let line = [];
        let lineBounds = Bounds_1.Bounds.empty();
        words.forEach((word) => {
            const nextLine = line.concat([word]);
            // Strip HTML if a raw string is passed
            const text = this.props.rawHtml
                ? Util_1.stripHTML(nextLine.join(" "))
                : nextLine.join(" ");
            const nextBounds = Bounds_1.Bounds.forText(text, {
                fontSize,
                fontWeight,
            });
            if (startsWithNewline(word) ||
                (nextBounds.width + 10 > maxWidth && line.length >= 1)) {
                lines.push({
                    text: line.join(" "),
                    width: lineBounds.width,
                    height: lineBounds.height,
                });
                line = [word];
                lineBounds = Bounds_1.Bounds.forText(word, { fontSize, fontWeight });
            }
            else {
                line = nextLine;
                lineBounds = nextBounds;
            }
        });
        if (line.length > 0)
            lines.push({
                text: line.join(" "),
                width: lineBounds.width,
                height: lineBounds.height,
            });
        return lines;
    }
    get height() {
        if (this.lines.length === 0)
            return 0;
        return (this.lines.reduce((total, line) => total + line.height, 0) +
            this.lineHeight * (this.lines.length - 1));
    }
    get width() {
        var _a;
        return (_a = Util_1.max(this.lines.map((l) => l.width))) !== null && _a !== void 0 ? _a : 0;
    }
    get htmlStyle() {
        const { fontSize, fontWeight, lineHeight } = this;
        return {
            fontSize: fontSize.toFixed(2) + "px",
            fontWeight: fontWeight,
            lineHeight: lineHeight,
            overflowY: "visible",
        };
    }
    renderHTML() {
        const { props, lines } = this;
        if (lines.length === 0)
            return null;
        // if (props.raw)
        //     return <p style={{ fontSize: fontSize.toFixed(2) + "px", lineHeight: lineHeight, width: this.width }} {...options} dangerouslySetInnerHTML={{__html: text}}/>
        // else
        //     return <p style={{ fontSize: fontSize.toFixed(2) + "px", lineHeight: lineHeight, width: this.width }} {...options}>{strip(text)}</p>
        return (React.createElement(React.Fragment, null, lines.map((line, index) => {
            const content = props.rawHtml ? (React.createElement("span", { dangerouslySetInnerHTML: {
                    __html: line.text,
                } })) : props.linkifyText ? (React.createElement("span", { dangerouslySetInnerHTML: {
                    __html: Util_1.linkify(line.text),
                } })) : (line.text);
            return (React.createElement(React.Fragment, { key: index },
                content,
                React.createElement("br", null)));
        })));
    }
    render(x, y, options) {
        //React.SVGAttributes<SVGTextElement>) {
        const { props, lines, fontSize, fontWeight, lineHeight } = this;
        if (lines.length === 0)
            return null;
        const yOffset = y + lines[0].height - lines[0].height * 0.2;
        return (React.createElement("text", Object.assign({ fontSize: fontSize.toFixed(2), fontWeight: fontWeight, x: x.toFixed(1), y: yOffset.toFixed(1) }, options), lines.map((line, i) => {
            if (props.rawHtml)
                return (React.createElement("tspan", { key: i, x: x, y: yOffset +
                        (i === 0 ? 0 : lineHeight * fontSize * i), dangerouslySetInnerHTML: { __html: line.text } }));
            else
                return (React.createElement("tspan", { key: i, x: x, y: yOffset +
                        (i === 0 ? 0 : lineHeight * fontSize * i) }, line.text));
        })));
    }
}
__decorate([
    mobx_1.computed
], TextWrap.prototype, "maxWidth", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "lineHeight", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "fontWeight", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "text", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "lines", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "height", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "width", null);
__decorate([
    mobx_1.computed
], TextWrap.prototype, "htmlStyle", null);
exports.TextWrap = TextWrap;
//# sourceMappingURL=TextWrap.js.map