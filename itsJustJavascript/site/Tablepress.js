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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
function cell(data) {
    return {
        data: data || "",
        colspan: 1,
        rowspan: 1,
    };
}
const ROWSPAN_TOKEN = "#rowspan#";
function parseTable(table) {
    const resultTable = [];
    table.forEach((row, r) => {
        const resultRow = [];
        row.forEach((data, c) => {
            if (data === ROWSPAN_TOKEN) {
                let i = r - 1;
                while (i >= 0 && table[i][c] === ROWSPAN_TOKEN) {
                    i--;
                }
                if (i >= 0) {
                    resultTable[i][c].rowspan++;
                }
                else {
                    resultRow.push(cell());
                }
            }
            else {
                resultRow.push(cell(data));
            }
        });
        resultTable.push(resultRow);
    });
    return resultTable;
}
function Tablepress(props) {
    const { data } = props;
    const table = parseTable(data);
    const [headerRow, ...body] = table;
    return (React.createElement("table", { className: "tablepress" },
        React.createElement("thead", null,
            React.createElement("tr", null, headerRow.map((cell, i) => (React.createElement("th", { key: i, dangerouslySetInnerHTML: { __html: cell.data } }))))),
        React.createElement("tbody", { className: "row-hover" }, body.map((row, i) => (React.createElement("tr", { key: i }, row.map((cell, j) => (React.createElement("td", { key: j, colSpan: cell.colspan, rowSpan: cell.rowspan, dangerouslySetInnerHTML: { __html: cell.data } })))))))));
}
exports.default = Tablepress;
//# sourceMappingURL=Tablepress.js.map