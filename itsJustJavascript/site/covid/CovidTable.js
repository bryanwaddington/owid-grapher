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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CovidTable = exports.CovidTableState = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const classnames_1 = __importDefault(require("classnames"));
const d3_scale_1 = require("d3-scale");
const d3_scale_chromatic_1 = require("d3-scale-chromatic");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faAngleDoubleDown_1 = require("@fortawesome/free-solid-svg-icons/faAngleDoubleDown");
const Util_1 = require("../../clientUtils/Util");
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
const CovidConstants_1 = require("./CovidConstants");
const CovidTypes_1 = require("./CovidTypes");
const CovidUtils_1 = require("./CovidUtils");
const CovidTableRow_1 = require("./CovidTableRow");
const CovidTableColumns_1 = require("./CovidTableColumns");
const CovidFetch_1 = require("./CovidFetch");
class CovidTableState {
    constructor(state) {
        this.sortKey = CovidTypes_1.CovidSortKey.totalCases;
        this.sortOrder = CoreTableConstants_1.SortOrder.desc;
        this.isMobile = false;
        this.truncate = false;
        this.truncateLength = 12;
        Util_1.extend(this, state);
    }
}
__decorate([
    mobx_1.observable.ref
], CovidTableState.prototype, "sortKey", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTableState.prototype, "sortOrder", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTableState.prototype, "isMobile", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTableState.prototype, "truncate", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTableState.prototype, "truncateLength", void 0);
exports.CovidTableState = CovidTableState;
let CovidTable = class CovidTable extends React.Component {
    constructor() {
        var _a;
        super(...arguments);
        this.data = (_a = this.props.preloadData) !== null && _a !== void 0 ? _a : undefined;
        this.isLoaded = !!this.props.preloadData;
        this.isLoading = false;
        this.error = undefined;
        this.tableState = new CovidTableState(this.props.defaultState);
    }
    componentDidMount() {
        if (!this.props.preloadData) {
            this.loadData();
        }
        this.onResizeThrottled = Util_1.throttle(this.onResize, 400);
        window.addEventListener("resize", this.onResizeThrottled);
        this.onResize();
    }
    componentWillUnmount() {
        if (this.onResizeThrottled) {
            window.removeEventListener("resize", this.onResizeThrottled);
        }
    }
    onResize() {
        this.tableState.isMobile = window.innerWidth <= 680;
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLoading = true;
            try {
                this.data = yield this.props.loadData();
                this.isLoaded = true;
                this.error = undefined;
            }
            catch (error) {
                this.error = error && error.message;
            }
            this.isLoading = false;
        });
    }
    get countrySeries() {
        if (this.data) {
            return Object.entries(Util_1.groupBy(this.data, (d) => d.location)).map(([location, series]) => {
                const sortedSeries = Util_1.sortBy(series, (d) => d.date);
                return {
                    id: location,
                    location: location,
                    series: sortedSeries,
                    latest: Util_1.maxBy(series, (d) => d.date),
                    latestWithTests: Util_1.maxBy(series.filter((d) => d.tests), (d) => d.date),
                    caseDoublingRange: CovidUtils_1.getDoublingRange(sortedSeries, (d) => d.totalCases),
                    deathDoublingRange: CovidUtils_1.getDoublingRange(sortedSeries, (d) => d.totalDeaths),
                };
            });
        }
        return [];
    }
    get rowData() {
        const { sortKey, sortOrder, truncate, truncateLength } = this.tableState;
        const accessor = CovidUtils_1.sortAccessors[sortKey];
        const sortedSeries = Util_1.orderBy(this.countrySeries, (d) => {
            const value = accessor(d);
            // In order for undefined values to always be last, we map them to +- Infinity
            return value !== undefined
                ? value
                : sortOrder === CoreTableConstants_1.SortOrder.asc
                    ? Infinity
                    : -Infinity;
        }, sortOrder);
        const [rest, hidden] = Util_1.partition(sortedSeries, this.props.filter);
        let [shown, truncated] = [rest, []];
        if (truncate) {
            ;
            [shown, truncated] = [
                rest.slice(0, truncateLength),
                rest.slice(truncateLength),
            ];
        }
        return {
            shown,
            truncated,
            hidden,
        };
    }
    get isTruncated() {
        return this.rowData.truncated.length > 0;
    }
    get dateRange() {
        const difference = this.tableState.isMobile ? 13 : 20; // inclusive, so 21 days technically
        if (this.data !== undefined && this.data.length > 0) {
            const maxDate = Util_1.max(this.data.map((d) => d.date));
            const minDate = Util_1.addDays(maxDate, -difference);
            return [minDate, maxDate];
        }
        return [Util_1.addDays(new Date(), -difference), new Date()];
    }
    get lastUpdated() {
        return this.dateRange[1];
    }
    get totalTestsBarScale() {
        var _a;
        const maxTests = Util_1.max((_a = this.data) === null || _a === void 0 ? void 0 : _a.map((d) => { var _a; return (_a = d.tests) === null || _a === void 0 ? void 0 : _a.totalTests; }));
        return d3_scale_1.scaleLinear()
            .domain([0, maxTests !== null && maxTests !== void 0 ? maxTests : 1])
            .range([0, 1]);
    }
    get columns() {
        return this.tableState.isMobile
            ? this.props.mobileColumns
            : this.props.columns;
    }
    onSort(newKey) {
        const { sortKey, sortOrder } = this.tableState;
        this.tableState.sortOrder =
            sortKey === newKey && sortOrder === CovidConstants_1.DEFAULT_SORT_ORDER
                ? CovidUtils_1.inverseSortOrder(CovidConstants_1.DEFAULT_SORT_ORDER)
                : CovidConstants_1.DEFAULT_SORT_ORDER;
        this.tableState.sortKey = newKey;
    }
    get headerCellProps() {
        const { sortKey, sortOrder, isMobile } = this.tableState;
        return {
            currentSortKey: sortKey,
            currentSortOrder: sortOrder,
            isMobile: isMobile,
            lastUpdated: this.lastUpdated,
            onSort: this.onSort,
        };
    }
    get countryColors() {
        const locations = Util_1.uniq((this.data || []).map((d) => d.location));
        const colors = d3_scale_chromatic_1.schemeCategory10;
        return Object.fromEntries(locations.map((l, i) => [l, colors[i % colors.length]]));
    }
    onShowMore() {
        this.tableState.truncate = false;
    }
    render() {
        if (this.isLoading) {
            return null;
        }
        if (this.error) {
            return (React.createElement("div", { className: "covid-error" }, "There was an error loading the live table."));
        }
        return (React.createElement("div", { className: classnames_1.default("covid-table-container", {
                "covid-table-mobile": this.tableState.isMobile,
            }) },
            React.createElement("div", { className: classnames_1.default("covid-table-wrapper", {
                    truncated: this.isTruncated,
                }) },
                React.createElement("table", { className: "covid-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null, this.columns.map((key) => (React.createElement(React.Fragment, { key: key }, CovidTableColumns_1.columns[key].header(this.headerCellProps)))))),
                    React.createElement("tbody", null, this.rowData.shown.map((datum) => (React.createElement(CovidTableRow_1.CovidTableRow, { key: datum.id, datum: datum, columns: this.columns, transform: {
                            dateRange: this.dateRange,
                            totalTestsBarScale: this
                                .totalTestsBarScale,
                            countryColors: this.countryColors,
                        }, extraRow: this.props.extraRow, state: this.tableState }))))),
                this.isTruncated && (React.createElement("div", { className: "show-more", onClick: this.onShowMore },
                    React.createElement("button", { className: "button" },
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleDoubleDown_1.faAngleDoubleDown })),
                        "Show more",
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleDoubleDown_1.faAngleDoubleDown })))))),
            React.createElement("div", { className: "covid-table-footer" }, this.props.footer)));
    }
};
CovidTable.defaultProps = {
    columns: [],
    mobileColumns: [],
    filter: (d) => d,
    loadData: CovidFetch_1.fetchJHUData,
    defaultState: {},
};
__decorate([
    mobx_1.observable.ref
], CovidTable.prototype, "data", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTable.prototype, "isLoaded", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTable.prototype, "isLoading", void 0);
__decorate([
    mobx_1.observable.ref
], CovidTable.prototype, "error", void 0);
__decorate([
    mobx_1.observable
], CovidTable.prototype, "tableState", void 0);
__decorate([
    mobx_1.action.bound
], CovidTable.prototype, "onResize", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "countrySeries", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "rowData", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "isTruncated", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "dateRange", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "lastUpdated", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "totalTestsBarScale", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "columns", null);
__decorate([
    mobx_1.action.bound
], CovidTable.prototype, "onSort", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "headerCellProps", null);
__decorate([
    mobx_1.computed
], CovidTable.prototype, "countryColors", null);
__decorate([
    mobx_1.action.bound
], CovidTable.prototype, "onShowMore", null);
CovidTable = __decorate([
    mobx_react_1.observer
], CovidTable);
exports.CovidTable = CovidTable;
//# sourceMappingURL=CovidTable.js.map