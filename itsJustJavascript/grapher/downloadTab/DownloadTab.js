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
exports.DownloadTab = void 0;
const Util_1 = require("../../clientUtils/Util");
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const LoadingIndicator_1 = require("../loadingIndicator/LoadingIndicator");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faDownload_1 = require("@fortawesome/free-solid-svg-icons/faDownload");
const classnames_1 = __importDefault(require("classnames"));
const OwidTable_1 = require("../../coreTable/OwidTable");
const polyfillToBlob = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
        value: function (callback, type, quality) {
            const binStr = atob(this
                .toDataURL(type, quality)
                .split(",")[1]);
            const len = binStr.length;
            const arr = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }
            callback(new Blob([arr], { type: type || "image/png" }));
        },
    });
};
// Wrapped because JSDOM does not support this method yet:
// https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function/56643520#56643520
const createObjectURL = (obj) => URL.createObjectURL ? URL.createObjectURL(obj) : "";
let DownloadTab = class DownloadTab extends React.Component {
    constructor() {
        super(...arguments);
        this.isReady = false;
    }
    get idealBounds() {
        var _a;
        return (_a = this.manager.idealBounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get targetWidth() {
        return this.idealBounds.width;
    }
    get targetHeight() {
        return this.idealBounds.height;
    }
    get manager() {
        return this.props.manager;
    }
    export() {
        if (!HTMLCanvasElement.prototype.toBlob)
            polyfillToBlob();
        this.createSvg();
        const reader = new FileReader();
        reader.onload = (ev) => {
            this.svgPreviewUrl = ev.target.result;
            this.tryCreatePng(this.svgPreviewUrl);
        };
        reader.readAsDataURL(this.svgBlob);
    }
    createSvg() {
        const staticSVG = this.manager.staticSVG;
        this.svgBlob = new Blob([staticSVG], {
            type: "image/svg+xml;charset=utf-8",
        });
        this.svgDownloadUrl = createObjectURL(this.svgBlob);
    }
    tryCreatePng(svgPreviewUrl) {
        const { targetWidth, targetHeight } = this;
        // Client-side SVG => PNG export. Somewhat experimental, so there's a lot of cross-browser fiddling and fallbacks here.
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                // We draw the chart at 4x res then scale it down again -- much better text quality
                canvas.width = targetWidth * 4;
                canvas.height = targetHeight * 4;
                const ctx = canvas.getContext("2d", {
                    alpha: false,
                });
                ctx.imageSmoothingEnabled = false;
                ctx.setTransform(4, 0, 0, 4, 0, 0);
                ctx.drawImage(img, 0, 0);
                this.pngPreviewUrl = canvas.toDataURL("image/png");
                canvas.toBlob((blob) => {
                    this.pngBlob = blob;
                    this.pngDownloadUrl = createObjectURL(blob);
                    this.markAsReady();
                });
            }
            catch (e) {
                console.error(e);
                this.markAsReady();
            }
        };
        img.onerror = (err) => {
            console.error(JSON.stringify(err));
            this.markAsReady();
        };
        img.src = svgPreviewUrl;
    }
    markAsReady() {
        this.isReady = true;
    }
    get fallbackPngUrl() {
        return `${this.manager.baseUrl || ""}.png${this.manager.queryStr || ""}`;
    }
    get baseFilename() {
        return this.manager.displaySlug;
    }
    onPNGDownload(ev) {
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(this.pngBlob, this.baseFilename + ".png");
            ev.preventDefault();
        }
    }
    onSVGDownload(ev) {
        if (!window.navigator.msSaveBlob)
            return;
        window.navigator.msSaveBlob(this.svgBlob, this.baseFilename + ".svg");
        ev.preventDefault();
    }
    get inputTable() {
        var _a;
        return (_a = this.manager.table) !== null && _a !== void 0 ? _a : OwidTable_1.BlankOwidTable();
    }
    onCsvDownload(ev) {
        const { manager, inputTable } = this;
        const csvFilename = manager.displaySlug + ".csv";
        const csv = inputTable.toPrettyCsv() || "";
        // IE11 compatibility
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(new Blob([csv], { type: "text/csv" }), csvFilename);
            ev.preventDefault();
        }
        else {
            const downloadLink = document.createElement("a");
            downloadLink.setAttribute("href", `data:text/csv,` + encodeURIComponent(csv));
            downloadLink.setAttribute("download", csvFilename);
            downloadLink.click();
        }
    }
    get csvButton() {
        const { manager } = this;
        const externalCsvLink = manager.externalCsvLink;
        const csvFilename = manager.displaySlug + ".csv";
        const props = externalCsvLink
            ? {
                href: externalCsvLink,
                download: csvFilename,
            }
            : {
                onClick: (ev) => this.onCsvDownload(ev),
            };
        return (React.createElement("div", { className: "download-csv", style: { maxWidth: "100%" } },
            React.createElement("p", null, "Download a CSV file containing all data used in this visualization:"),
            React.createElement("a", Object.assign({ className: "btn btn-primary", "data-track-note": "chart-download-csv" }, props),
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload }),
                " ",
                csvFilename)));
    }
    renderReady() {
        const { targetWidth, targetHeight, svgPreviewUrl, svgDownloadUrl, baseFilename, bounds, } = this;
        const pngPreviewUrl = this.pngPreviewUrl || this.fallbackPngUrl;
        const pngDownloadUrl = this.pngDownloadUrl || pngPreviewUrl;
        let previewWidth;
        let previewHeight;
        const boundScalar = 0.4;
        if (bounds.width / bounds.height > targetWidth / targetHeight) {
            previewHeight = bounds.height * boundScalar;
            previewWidth = (targetWidth / targetHeight) * previewHeight;
        }
        else {
            previewWidth = bounds.width * boundScalar;
            previewHeight = (targetHeight / targetWidth) * previewWidth;
        }
        const imgStyle = {
            minWidth: previewWidth,
            minHeight: previewHeight,
            maxWidth: previewWidth,
            maxHeight: previewHeight,
            border: "1px solid #ccc",
        };
        const asideStyle = {
            maxWidth: previewWidth,
        };
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "img-downloads" },
                React.createElement("a", { key: "png", href: pngDownloadUrl, download: baseFilename + ".png", "data-track-note": "chart-download-png", onClick: this.onPNGDownload },
                    React.createElement("div", null,
                        React.createElement("img", { src: pngPreviewUrl, style: imgStyle }),
                        React.createElement("aside", { style: asideStyle },
                            React.createElement("h2", null, "Save as .png"),
                            React.createElement("p", null, "A standard image of the visualization that can be used in presentations or other documents.")))),
                React.createElement("a", { key: "svg", href: svgDownloadUrl, download: baseFilename + ".svg", "data-track-note": "chart-download-svg", onClick: this.onSVGDownload },
                    React.createElement("div", null,
                        React.createElement("img", { src: svgPreviewUrl, style: imgStyle }),
                        React.createElement("aside", { style: asideStyle },
                            React.createElement("h2", null, "Save as .svg"),
                            React.createElement("p", null, "A vector format image useful for further redesigning the visualization with vector graphic software."))))),
            this.csvButton));
    }
    componentDidMount() {
        this.export();
    }
    componentWillUnmount() {
        if (this.pngDownloadUrl !== undefined)
            URL.revokeObjectURL(this.pngDownloadUrl);
        if (this.svgDownloadUrl !== undefined)
            URL.revokeObjectURL(this.svgDownloadUrl);
    }
    render() {
        return (React.createElement("div", { className: classnames_1.default("DownloadTab", {
                mobile: Util_1.isMobile(),
            }), style: Object.assign(Object.assign({}, this.bounds.toCSS()), { position: "absolute" }) }, this.isReady ? (this.renderReady()) : (React.createElement(LoadingIndicator_1.LoadingIndicator, { color: "#000" }))));
    }
};
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "idealBounds", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "targetWidth", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "targetHeight", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "manager", null);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "svgBlob", void 0);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "svgDownloadUrl", void 0);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "svgPreviewUrl", void 0);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "pngBlob", void 0);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "pngDownloadUrl", void 0);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "pngPreviewUrl", void 0);
__decorate([
    mobx_1.observable
], DownloadTab.prototype, "isReady", void 0);
__decorate([
    mobx_1.action.bound
], DownloadTab.prototype, "export", null);
__decorate([
    mobx_1.action.bound
], DownloadTab.prototype, "createSvg", null);
__decorate([
    mobx_1.action.bound
], DownloadTab.prototype, "tryCreatePng", null);
__decorate([
    mobx_1.action.bound
], DownloadTab.prototype, "markAsReady", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "fallbackPngUrl", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "baseFilename", null);
__decorate([
    mobx_1.action.bound
], DownloadTab.prototype, "onPNGDownload", null);
__decorate([
    mobx_1.action.bound
], DownloadTab.prototype, "onSVGDownload", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], DownloadTab.prototype, "csvButton", null);
DownloadTab = __decorate([
    mobx_react_1.observer
], DownloadTab);
exports.DownloadTab = DownloadTab;
//# sourceMappingURL=DownloadTab.js.map