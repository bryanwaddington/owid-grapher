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
exports.runVariableCountryPage = void 0;
const React = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const Util_1 = require("../clientUtils/Util");
const mobx_1 = require("mobx");
const Grapher_1 = require("../grapher/core/Grapher");
const GrapherFigureView_1 = require("./GrapherFigureView");
const mobx_react_1 = require("mobx-react");
let ClientVariableCountryPage = class ClientVariableCountryPage extends React.Component {
    get grapherConfig() {
        const { variable, country } = this.props.countryPageProps;
        return {
            yAxis: { min: 0 },
            map: { variableId: variable.id },
            tab: "chart",
            hasMapTab: true,
            dimensions: [
                {
                    property: "y",
                    variableId: variable.id,
                    display: Util_1.clone(variable.display),
                },
            ],
            selectedEntityNames: [country.name],
        };
    }
    componentDidMount() {
        this.grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, this.grapherConfig), { isEmbeddedInAnOwidPage: true }));
    }
    render() {
        const { variable, country } = this.props.countryPageProps;
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", null,
                variable.name,
                " in ",
                country.name),
            this.grapher && React.createElement(GrapherFigureView_1.GrapherFigureView, { grapher: this.grapher })));
    }
};
__decorate([
    mobx_1.observable.ref
], ClientVariableCountryPage.prototype, "grapher", void 0);
__decorate([
    mobx_1.computed
], ClientVariableCountryPage.prototype, "grapherConfig", null);
ClientVariableCountryPage = __decorate([
    mobx_react_1.observer
], ClientVariableCountryPage);
function runVariableCountryPage(props) {
    react_dom_1.default.render(React.createElement(ClientVariableCountryPage, { countryPageProps: props }), document.querySelector("main"));
}
exports.runVariableCountryPage = runVariableCountryPage;
//# sourceMappingURL=runVariableCountryPage.js.map