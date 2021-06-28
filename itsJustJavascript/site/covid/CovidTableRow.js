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
exports.CovidTableRow = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const decko_1 = require("decko");
const Util_1 = require("../../clientUtils/Util");
const CovidTableColumns_1 = require("./CovidTableColumns");
let CovidTableRow = class CovidTableRow extends React.Component {
    constructor() {
        super(...arguments);
        this.highlightDate = undefined;
    }
    get data() {
        const d = this.props.datum;
        const [start, end] = this.props.transform.dateRange;
        return d.series.filter((d) => d.date >= start && d.date <= end);
    }
    dateToIndex(date) {
        return Util_1.dateDiffInDays(date, this.props.transform.dateRange[0]);
    }
    dateFromIndex(index) {
        return Util_1.addDays(this.props.transform.dateRange[0], index);
    }
    get xDomain() {
        const [start, end] = this.props.transform.dateRange;
        return [0, Util_1.dateDiffInDays(end, start)];
    }
    get currentX() {
        const { datum } = this.props;
        if (datum.latest) {
            return this.x(datum.latest);
        }
        return undefined;
    }
    get hightlightedX() {
        const { state } = this.props;
        if (!state.isMobile && this.highlightDate) {
            return this.dateToIndex(this.highlightDate);
        }
        return undefined;
    }
    x(d) {
        return this.dateToIndex(d.date);
    }
    onBarHover(d, i) {
        let date;
        if (d !== undefined) {
            date = d.date;
        }
        else if (i !== undefined) {
            date = this.dateFromIndex(i);
        }
        else {
            date = undefined;
        }
        this.highlightDate = date;
    }
    get cellProps() {
        return {
            datum: this.props.datum,
            isMobile: this.props.state.isMobile,
            bars: {
                data: this.data,
                xDomain: this.xDomain,
                x: this.x,
                currentX: this.currentX,
                highlightedX: this.hightlightedX,
                onHover: this.onBarHover,
            },
            totalTestsBarScale: this.props.transform.totalTestsBarScale,
            countryColors: this.props.transform.countryColors,
            baseRowSpan: this.props.extraRow ? 2 : 1,
        };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("tr", { className: this.props.className }, this.props.columns.map((key) => (React.createElement(React.Fragment, { key: key }, CovidTableColumns_1.columns[key].cell(this.cellProps))))),
            this.props.extraRow ? (React.createElement("tr", { className: this.props.className }, this.props.extraRow(this.cellProps))) : undefined));
    }
};
CovidTableRow.defaultProps = {
    onHighlightDate: () => undefined,
};
__decorate([
    mobx_1.observable.ref
], CovidTableRow.prototype, "highlightDate", void 0);
__decorate([
    mobx_1.computed
], CovidTableRow.prototype, "data", null);
__decorate([
    decko_1.bind
], CovidTableRow.prototype, "dateToIndex", null);
__decorate([
    decko_1.bind
], CovidTableRow.prototype, "dateFromIndex", null);
__decorate([
    mobx_1.computed
], CovidTableRow.prototype, "xDomain", null);
__decorate([
    mobx_1.computed
], CovidTableRow.prototype, "currentX", null);
__decorate([
    mobx_1.computed
], CovidTableRow.prototype, "hightlightedX", null);
__decorate([
    decko_1.bind
], CovidTableRow.prototype, "x", null);
__decorate([
    decko_1.bind
], CovidTableRow.prototype, "onBarHover", null);
__decorate([
    mobx_1.computed
], CovidTableRow.prototype, "cellProps", null);
CovidTableRow = __decorate([
    mobx_react_1.observer
], CovidTableRow);
exports.CovidTableRow = CovidTableRow;
//# sourceMappingURL=CovidTableRow.js.map