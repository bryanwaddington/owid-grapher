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
exports.CovidTableHeaderCell = void 0;
const React = __importStar(require("react"));
const decko_1 = require("decko");
const classnames_1 = __importDefault(require("classnames"));
const CovidTableSortIcon_1 = require("./CovidTableSortIcon");
const CovidConstants_1 = require("./CovidConstants");
class CovidTableHeaderCell extends React.Component {
    onClick() {
        if (this.props.sortKey && this.props.onSort) {
            this.props.onSort(this.props.sortKey);
        }
    }
    render() {
        const { className, sortKey, children, colSpan, currentSortKey, currentSortOrder, } = this.props;
        const isSorted = sortKey !== undefined && sortKey === currentSortKey;
        const order = isSorted && currentSortOrder ? currentSortOrder : CovidConstants_1.DEFAULT_SORT_ORDER;
        return (React.createElement("th", { className: classnames_1.default(className, {
                sortable: sortKey !== undefined,
                sorted: isSorted,
            }), onClick: this.onClick, colSpan: colSpan },
            children,
            sortKey !== undefined && (React.createElement(CovidTableSortIcon_1.CovidTableSortIcon, { sortOrder: order, isActive: isSorted }))));
    }
}
__decorate([
    decko_1.bind
], CovidTableHeaderCell.prototype, "onClick", null);
exports.CovidTableHeaderCell = CovidTableHeaderCell;
//# sourceMappingURL=CovidTableHeaderCell.js.map