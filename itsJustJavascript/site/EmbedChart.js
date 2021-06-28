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
exports.EmbedChart = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Grapher_1 = require("../grapher/core/Grapher");
const GrapherFigureView_1 = require("./GrapherFigureView");
const serializers_1 = require("../clientUtils/serializers");
const Url_1 = require("../clientUtils/urls/Url");
let EmbedChart = class EmbedChart extends React.Component {
    get url() {
        return Url_1.Url.fromURL(this.props.src);
    }
    get configUrl() {
        return this.url.originAndPath;
    }
    get queryStr() {
        return this.url.queryStr;
    }
    loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const { configUrl } = this;
            if (configUrl === undefined)
                return;
            const resp = yield fetch(configUrl);
            if (this.configUrl !== configUrl) {
                // Changed while we were fetching
                return;
            }
            const html = yield resp.text();
            const config = serializers_1.deserializeJSONFromHTML(html);
            mobx_1.runInAction(() => {
                this.grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, config), { isEmbeddedInAnOwidPage: true, queryStr: this.queryStr }));
            });
        });
    }
    componentDidMount() {
        this.dispose = mobx_1.autorun(() => this.props.src && this.loadConfig());
    }
    componentWillUnmount() {
        if (this.dispose)
            this.dispose();
    }
    render() {
        return this.grapher ? (React.createElement(GrapherFigureView_1.GrapherFigureView, { grapher: this.grapher })) : (React.createElement("figure", { "data-grapher-src": this.props.src }));
    }
};
__decorate([
    mobx_1.computed
], EmbedChart.prototype, "url", null);
__decorate([
    mobx_1.computed
], EmbedChart.prototype, "configUrl", null);
__decorate([
    mobx_1.computed
], EmbedChart.prototype, "queryStr", null);
__decorate([
    mobx_1.observable
], EmbedChart.prototype, "grapher", void 0);
EmbedChart = __decorate([
    mobx_react_1.observer
], EmbedChart);
exports.EmbedChart = EmbedChart;
//# sourceMappingURL=EmbedChart.js.map