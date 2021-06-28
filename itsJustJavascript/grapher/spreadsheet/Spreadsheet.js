"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spreadsheet = void 0;
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const react_2 = require("@handsontable/react");
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const OwidTable_1 = require("../../coreTable/OwidTable");
let Spreadsheet = class Spreadsheet extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.hotTableComponent = react_1.default.createRef();
        this._version = "";
    }
    updateFromHot() {
        var _a;
        const newVersion = (_a = this.hotTableComponent.current) === null || _a === void 0 ? void 0 : _a.hotInstance.getData();
        if (!newVersion || !this.isChanged(newVersion))
            return;
        this.manager.table = new OwidTable_1.OwidTable(newVersion);
    }
    isChanged(newVersion) {
        return new OwidTable_1.OwidTable(newVersion).toDelimited() !== this._version;
    }
    componentDidMount() {
        Util_1.exposeInstanceOnWindow(this, "spreadsheet");
    }
    get manager() {
        return this.props.manager;
    }
    render() {
        const { table } = this.manager;
        this._version = table.toDelimited();
        const data = table.toMatrix();
        const hotSettings = {
            afterChange: () => this.updateFromHot(),
            allowInsertColumn: true,
            allowInsertRow: true,
            autoColumnSize: true,
            colHeaders: false,
            contextMenu: true,
            data,
            height: 250,
            minSpareRows: 2,
            minSpareCols: 2,
            rowHeaders: true,
            rowHeights: 23,
            stretchH: "all",
            width: "100%",
            wordWrap: false,
        };
        return (react_1.default.createElement(react_2.HotTable, { settings: hotSettings, ref: this.hotTableComponent, licenseKey: "non-commercial-and-evaluation" }));
    }
};
__decorate([
    mobx_1.action.bound
], Spreadsheet.prototype, "updateFromHot", null);
__decorate([
    mobx_1.computed
], Spreadsheet.prototype, "manager", null);
Spreadsheet = __decorate([
    mobx_react_1.observer
], Spreadsheet);
exports.Spreadsheet = Spreadsheet;
//# sourceMappingURL=Spreadsheet.js.map