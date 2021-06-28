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
exports.DataTable = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const classnames_1 = __importDefault(require("classnames"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faInfoCircle_1 = require("@fortawesome/free-solid-svg-icons/faInfoCircle");
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
const Util_1 = require("../../clientUtils/Util");
const SortIcon_1 = require("../controls/SortIcon");
const Tippy_1 = require("../chart/Tippy");
const OwidTable_1 = require("../../coreTable/OwidTable");
const Bounds_1 = require("../../clientUtils/Bounds");
const ChartUtils_1 = require("../chart/ChartUtils");
const ENTITY_DIM_INDEX = -1;
const DEFAULT_SORT_STATE = {
    dimIndex: ENTITY_DIM_INDEX,
    columnKey: undefined,
    order: CoreTableConstants_1.SortOrder.asc,
};
const columnNameByType = {
    single: "Value",
    start: "Start",
    end: "End",
    delta: "Absolute Change",
    deltaRatio: "Relative Change",
};
const inverseSortOrder = (order) => order === CoreTableConstants_1.SortOrder.asc ? CoreTableConstants_1.SortOrder.desc : CoreTableConstants_1.SortOrder.asc;
let DataTable = class DataTable extends React.Component {
    constructor() {
        super(...arguments);
        this.storedState = {
            sort: DEFAULT_SORT_STATE,
        };
        this.AUTO_SELECTION_THRESHOLD_PERCENTAGE = 0.5;
    }
    get tableState() {
        return {
            sort: this.sortState,
        };
    }
    get sortState() {
        let { dimIndex, columnKey, order } = Object.assign(Object.assign({}, DEFAULT_SORT_STATE), this.storedState.sort);
        // If not sorted by entity, then make sure the index of the chosen column exists
        dimIndex = Math.min(dimIndex, this.table.numColumns - 1);
        if (dimIndex !== ENTITY_DIM_INDEX) {
            const availableColumns = this.columnsWithValues[dimIndex].columns.map((sub) => sub.key);
            if (columnKey === undefined ||
                !availableColumns.includes(columnKey))
                columnKey = availableColumns[0];
        }
        return {
            dimIndex,
            columnKey,
            order,
        };
    }
    get table() {
        return this.inputTable;
    }
    get inputTable() {
        return this.manager.table;
    }
    get manager() {
        return this.props.manager || { table: OwidTable_1.BlankOwidTable() };
    }
    get entityType() {
        return this.table.entityType;
    }
    get sortValueMapper() {
        const { dimIndex, columnKey, order } = this.tableState.sort;
        if (dimIndex === ENTITY_DIM_INDEX)
            return (row) => row.entityName;
        return (row) => {
            var _a, _b;
            const dv = row.dimensionValues[dimIndex];
            let value;
            if (dv) {
                if (isSingleValue(dv))
                    value = (_a = dv.single) === null || _a === void 0 ? void 0 : _a.value;
                else if (isRangeValue(dv) &&
                    columnKey !== undefined &&
                    columnKey in RangeValueKey)
                    value = (_b = dv[columnKey]) === null || _b === void 0 ? void 0 : _b.value;
            }
            // We always want undefined values to be last
            if (value === undefined ||
                (typeof value === "number" &&
                    (!isFinite(value) || isNaN(value))))
                return order === CoreTableConstants_1.SortOrder.asc ? Infinity : -Infinity;
            return value;
        };
    }
    get hasSubheaders() {
        return this.displayDimensions.some((header) => header.columns.length > 1);
    }
    updateSort(dimIndex, columnKey) {
        const { sort } = this.tableState;
        const order = sort.dimIndex === dimIndex && sort.columnKey === columnKey
            ? inverseSortOrder(sort.order)
            : dimIndex === ENTITY_DIM_INDEX
                ? CoreTableConstants_1.SortOrder.asc
                : CoreTableConstants_1.SortOrder.desc;
        this.storedState.sort.dimIndex = dimIndex;
        this.storedState.sort.columnKey = columnKey;
        this.storedState.sort.order = order;
    }
    get entityHeader() {
        const { sort } = this.tableState;
        return (React.createElement(ColumnHeader, { key: "entity", sortable: true, sortedCol: sort.dimIndex === ENTITY_DIM_INDEX, sortOrder: sort.order, onClick: () => this.updateSort(ENTITY_DIM_INDEX), rowSpan: this.hasSubheaders ? 2 : 1, headerText: Util_1.capitalize(this.entityType), colType: "entity", dataType: "text" }));
    }
    get dimensionHeaders() {
        const { sort } = this.tableState;
        return this.displayDimensions.map((dim, dimIndex) => {
            const actualColumn = dim.coreTableColumn;
            const unit = actualColumn.unit === "%" ? "percent" : dim.coreTableColumn.unit;
            const columnName = actualColumn.displayName !== ""
                ? actualColumn.displayName
                : actualColumn.name;
            const dimensionHeaderText = (React.createElement(React.Fragment, null,
                React.createElement("span", { className: "name" }, Util_1.upperFirst(columnName)),
                React.createElement("span", { className: "unit" }, unit)));
            const props = {
                sortable: dim.sortable,
                sortedCol: dim.sortable && sort.dimIndex === dimIndex,
                sortOrder: sort.order,
                onClick: () => {
                    if (dim.sortable) {
                        this.updateSort(dimIndex, SingleValueKey.single);
                    }
                },
                rowSpan: this.hasSubheaders && dim.columns.length < 2 ? 2 : 1,
                colSpan: dim.columns.length,
                headerText: dimensionHeaderText,
                colType: "dimension",
                dataType: "numeric",
            };
            return React.createElement(ColumnHeader, Object.assign({ key: actualColumn.slug }, props));
        });
    }
    get dimensionSubheaders() {
        const { sort } = this.tableState;
        return this.displayDimensions.map((dim, dimIndex) => dim.columns.map((column, i) => {
            const headerText = isDeltaColumn(column.key)
                ? columnNameByType[column.key]
                : dim.coreTableColumn.table.formatTime(column.targetTime);
            return (React.createElement(ColumnHeader, { key: column.key, sortable: column.sortable, sortedCol: sort.dimIndex === dimIndex &&
                    sort.columnKey === column.key, sortOrder: sort.order, onClick: () => this.updateSort(dimIndex, column.key), headerText: headerText, colType: "subdimension", dataType: "numeric", subdimensionType: column.key, lastSubdimension: i === dim.columns.length - 1 }));
        }));
    }
    get headerRow() {
        return (React.createElement(React.Fragment, null,
            React.createElement("tr", null,
                this.entityHeader,
                this.dimensionHeaders),
            this.hasSubheaders && React.createElement("tr", null, this.dimensionSubheaders)));
    }
    renderValueCell(key, column, dv, sorted, actualColumn) {
        if (dv === undefined || !(column.key in dv))
            return React.createElement("td", { key: key, className: "dimension" });
        let value;
        if (isSingleValue(dv))
            value = dv[column.key];
        else if (isRangeValue(dv))
            value = dv[column.key];
        if (value === undefined)
            return React.createElement("td", { key: key, className: "dimension" });
        const shouldShowClosestTimeNotice = value.time !== undefined &&
            !isDeltaColumn(column.key) &&
            column.targetTime !== undefined &&
            column.targetTime !== value.time;
        return (React.createElement("td", { key: key, className: classnames_1.default([
                "dimension",
                `dimension-${column.key}`,
                {
                    sorted,
                },
            ]) },
            shouldShowClosestTimeNotice &&
                makeClosestTimeNotice(actualColumn.table.formatTime(column.targetTime), actualColumn.table.formatTime(value.time) // todo: add back format: "MMM D",
                ),
            value.displayValue));
    }
    renderEntityRow(row, dimensions) {
        const { sort } = this.tableState;
        return (React.createElement("tr", { key: row.entityName },
            React.createElement("td", { key: "entity", className: classnames_1.default({
                    entity: true,
                    sorted: sort.dimIndex === ENTITY_DIM_INDEX,
                }) }, row.entityName),
            row.dimensionValues.map((dv, dimIndex) => {
                const dimension = dimensions[dimIndex];
                return dimension.columns.map((column, colIndex) => {
                    const key = `${dimIndex}-${colIndex}`;
                    return this.renderValueCell(key, column, dv, sort.dimIndex === dimIndex &&
                        sort.columnKey === column.key, dimension.coreTableColumn);
                });
            })));
    }
    get valueRows() {
        return this.sortedRows.map((row) => this.renderEntityRow(row, this.displayDimensions));
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    render() {
        return (React.createElement("div", { style: {
                width: "100%",
                height: "100%",
                overflow: "auto",
            } },
            React.createElement("table", { className: "data-table" },
                React.createElement("thead", null, this.headerRow),
                React.createElement("tbody", null, this.valueRows))));
    }
    get loadedWithData() {
        return this.columnsToShow.length > 0;
    }
    /**
     * If the user or the editor hasn't specified a start, auto-select a start time
     *  where AUTO_SELECTION_THRESHOLD_PERCENTAGE of the entities have values.
     */
    get autoSelectedStartTime() {
        let autoSelectedStartTime = undefined;
        if (
        // this.grapher.userHasSetTimeline ||
        //this.initialTimelineStartTimeSpecified ||
        !this.loadedWithData)
            return undefined;
        const numEntitiesInTable = this.entityNames.length;
        this.columnsToShow.forEach((column) => {
            var _a;
            const numberOfEntitiesWithDataSortedByTime = Util_1.sortBy(Object.entries(Util_1.countBy(column.uniqTimesAsc)), (value) => parseInt(value[0]));
            const firstTimeWithSufficientData = (_a = numberOfEntitiesWithDataSortedByTime.find((time) => {
                const numEntitiesWithData = time[1];
                const percentEntitiesWithData = numEntitiesWithData / numEntitiesInTable;
                return (percentEntitiesWithData >=
                    this.AUTO_SELECTION_THRESHOLD_PERCENTAGE);
            })) === null || _a === void 0 ? void 0 : _a[0];
            if (firstTimeWithSufficientData) {
                autoSelectedStartTime = parseInt(firstTimeWithSufficientData);
                return false;
            }
            return true;
        });
        return autoSelectedStartTime;
    }
    get columnsToShow() {
        var _a;
        const slugs = (_a = this.manager.dataTableSlugs) !== null && _a !== void 0 ? _a : [];
        if (slugs.length)
            return slugs
                .map((slug) => {
                const col = this.table.get(slug);
                if (!col)
                    console.log(`Warning: column '${slug}' not found`);
                return col;
            })
                .filter((col) => col);
        const skips = new Set(Object.keys(OwidTableConstants_1.OwidTableSlugs));
        return this.table.columnsAsArray.filter((column) => {
            var _a, _b;
            return !skips.has(column.slug) &&
                //  dim.property !== "color" &&
                ((_b = (_a = column.display) === null || _a === void 0 ? void 0 : _a.includeInTable) !== null && _b !== void 0 ? _b : true);
        });
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    get entityNames() {
        let tableForEntities = this.table;
        if (this.manager.minPopulationFilter)
            tableForEntities = tableForEntities.filterByPopulationExcept(this.manager.minPopulationFilter, this.selectionArray.selectedEntityNames);
        return Util_1.union(...this.columnsToShow.map((col) => tableForEntities.get(col.slug).uniqEntityNames));
    }
    componentDidMount() {
        Util_1.exposeInstanceOnWindow(this, "dataTable");
    }
    formatValue(column, value, formattingOverrides) {
        return value === undefined
            ? value
            : column.formatValueShort(value, Object.assign({ numberPrefixes: false, noTrailingZeroes: false }, formattingOverrides));
    }
    get targetTimes() {
        const { startTime, endTime } = this.manager;
        if (startTime === undefined || endTime === undefined)
            return undefined;
        if (startTime !== endTime)
            return [startTime, endTime];
        return [endTime];
    }
    // todo: this function should be refactored. It's about 5x-10x too long. I'm currently getting an undefined value but it's very hard to figure out where.
    get columnsWithValues() {
        return this.columnsToShow.map((sourceColumn) => {
            var _a;
            const targetTimes = (_a = this.targetTimes) !== null && _a !== void 0 ? _a : [sourceColumn.maxTime];
            const targetTimeMode = targetTimes.length < 2
                ? TargetTimeMode.point
                : TargetTimeMode.range;
            const prelimValuesByEntity = targetTimeMode === TargetTimeMode.range
                ? // In the "range" mode, we receive all data values within the range. But we
                    // only want to plot the start & end values in the table.
                    // getStartEndValues() extracts these two values.
                    Util_1.es6mapValues(Util_1.valuesByEntityWithinTimes(sourceColumn.valueByEntityNameAndTime, targetTimes), Util_1.getStartEndValues)
                : Util_1.valuesByEntityAtTimes(sourceColumn.valueByEntityNameAndTime, targetTimes, sourceColumn.tolerance);
            const isRange = targetTimes.length === 2;
            // Inject delta columns if we have start & end values to compare in the table.
            // One column for absolute difference, another for % difference.
            const deltaColumns = [];
            if (isRange) {
                const tableDisplay = {};
                if (!(tableDisplay === null || tableDisplay === void 0 ? void 0 : tableDisplay.hideAbsoluteChange))
                    deltaColumns.push({ key: RangeValueKey.delta });
                if (!(tableDisplay === null || tableDisplay === void 0 ? void 0 : tableDisplay.hideRelativeChange))
                    deltaColumns.push({ key: RangeValueKey.deltaRatio });
            }
            const columns = [
                ...targetTimes.map((targetTime, index) => ({
                    key: isRange
                        ? index === 0
                            ? RangeValueKey.start
                            : RangeValueKey.end
                        : SingleValueKey.single,
                    targetTime,
                    targetTimeMode,
                })),
                ...deltaColumns,
            ];
            const valueByEntity = Util_1.es6mapValues(prelimValuesByEntity, (dvs) => {
                // There is always a column, but not always a data value (in the delta column the
                // value needs to be calculated)
                if (isRange) {
                    const [start, end] = dvs;
                    const result = {
                        start: Object.assign(Object.assign({}, start), { displayValue: this.formatValue(sourceColumn, start === null || start === void 0 ? void 0 : start.value) }),
                        end: Object.assign(Object.assign({}, end), { displayValue: this.formatValue(sourceColumn, end === null || end === void 0 ? void 0 : end.value) }),
                        delta: undefined,
                        deltaRatio: undefined,
                    };
                    if (start !== undefined &&
                        end !== undefined &&
                        typeof start.value === "number" &&
                        typeof end.value === "number") {
                        const deltaValue = end.value - start.value;
                        const deltaRatioValue = deltaValue / Math.abs(start.value);
                        result.delta = {
                            value: deltaValue,
                            displayValue: this.formatValue(sourceColumn, deltaValue, {
                                showPlus: true,
                                unit: sourceColumn.shortUnit === "%"
                                    ? "pp"
                                    : sourceColumn.shortUnit,
                            }),
                        };
                        result.deltaRatio = {
                            value: deltaRatioValue,
                            displayValue: isFinite(deltaRatioValue) &&
                                !isNaN(deltaRatioValue)
                                ? this.formatValue(sourceColumn, deltaRatioValue * 100, {
                                    unit: "%",
                                    numDecimalPlaces: 0,
                                    showPlus: true,
                                })
                                : undefined,
                        };
                    }
                    return result;
                }
                else {
                    // if single time
                    const dv = dvs[0];
                    const result = {
                        single: Object.assign({}, dv),
                    };
                    if (dv !== undefined)
                        result.single.displayValue = this.formatValue(sourceColumn, dv.value);
                    return result;
                }
            });
            return {
                columns,
                valueByEntity,
                sourceColumn,
            };
        });
    }
    get displayDimensions() {
        // Todo: for sorting etc, use CoreTable?
        return this.columnsWithValues.map((d) => ({
            // A top-level header is only sortable if it has a single nested column, because
            // in that case the nested column is not rendered.
            sortable: d.columns.length === 1,
            columns: d.columns.map((column) => (Object.assign(Object.assign({}, column), { 
                // All columns are sortable for now, but in the future we will have a sparkline that
                // is not sortable.
                sortable: true }))),
            coreTableColumn: d.sourceColumn,
        }));
    }
    get sortedRows() {
        const { order } = this.tableState.sort;
        return Util_1.orderBy(this.displayRows, this.sortValueMapper, [order]);
    }
    get displayRows() {
        return this.entityNames.map((entityName) => {
            return {
                entityName,
                dimensionValues: this.columnsWithValues.map((d) => d.valueByEntity.get(entityName)),
            };
        });
    }
};
__decorate([
    mobx_1.observable
], DataTable.prototype, "storedState", void 0);
__decorate([
    mobx_1.computed
], DataTable.prototype, "tableState", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "sortState", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "table", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "manager", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "entityType", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "sortValueMapper", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "hasSubheaders", null);
__decorate([
    mobx_1.action.bound
], DataTable.prototype, "updateSort", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "loadedWithData", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "autoSelectedStartTime", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "columnsToShow", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "entityNames", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "targetTimes", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "columnsWithValues", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "displayDimensions", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "sortedRows", null);
__decorate([
    mobx_1.computed
], DataTable.prototype, "displayRows", null);
DataTable = __decorate([
    mobx_react_1.observer
], DataTable);
exports.DataTable = DataTable;
function ColumnHeader(props) {
    var _a, _b;
    const { sortable, sortedCol, colType, subdimensionType, lastSubdimension, } = props;
    return (React.createElement("th", { className: classnames_1.default(colType, {
            sortable,
            sorted: sortedCol,
            firstSubdimension: subdimensionType === "start",
            endSubdimension: subdimensionType === "end",
            lastSubdimension,
        }), rowSpan: (_a = props.rowSpan) !== null && _a !== void 0 ? _a : 1, colSpan: (_b = props.colSpan) !== null && _b !== void 0 ? _b : 1, onClick: props.onClick },
        React.createElement("div", { className: classnames_1.default({
                deltaColumn: isDeltaColumn(subdimensionType),
            }) },
            props.headerText,
            sortable && (React.createElement(SortIcon_1.SortIcon, { type: props.dataType, isActiveIcon: sortedCol, order: sortedCol
                    ? props.sortOrder
                    : colType === "entity"
                        ? CoreTableConstants_1.SortOrder.asc
                        : CoreTableConstants_1.SortOrder.desc })))));
}
const makeClosestTimeNotice = (targetTime, closestTime) => (React.createElement(Tippy_1.Tippy, { content: React.createElement("div", { className: "closest-time-notice-tippy" },
        React.createElement("strong", null,
            "Data not available for ",
            targetTime),
        React.createElement("br", null),
        "Showing closest available data point (",
        closestTime,
        ")"), arrow: false },
    React.createElement("span", { className: "closest-time-notice-icon" },
        closestTime,
        " ",
        React.createElement("span", { className: "icon" },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faInfoCircle_1.faInfoCircle })))));
var TargetTimeMode;
(function (TargetTimeMode) {
    TargetTimeMode["point"] = "point";
    TargetTimeMode["range"] = "range";
})(TargetTimeMode || (TargetTimeMode = {}));
// range (two point values)
var RangeValueKey;
(function (RangeValueKey) {
    RangeValueKey["start"] = "start";
    RangeValueKey["end"] = "end";
    RangeValueKey["delta"] = "delta";
    RangeValueKey["deltaRatio"] = "deltaRatio";
})(RangeValueKey || (RangeValueKey = {}));
function isRangeValue(value) {
    return "start" in value;
}
// single point values
var SingleValueKey;
(function (SingleValueKey) {
    SingleValueKey["single"] = "single";
})(SingleValueKey || (SingleValueKey = {}));
function isSingleValue(value) {
    return "single" in value;
}
function isDeltaColumn(columnKey) {
    return columnKey === "delta" || columnKey === "deltaRatio";
}
//# sourceMappingURL=DataTable.js.map