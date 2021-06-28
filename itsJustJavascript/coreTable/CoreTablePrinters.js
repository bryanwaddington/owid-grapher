"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDelimited = exports.toMarkdownTable = exports.toAlignedTextTable = void 0;
// Output a pretty table for consles
const toAlignedTextTable = (headerSlugs, rows, options = {}) => {
    const { alignRight = true, maxCharactersPerColumn = 20, maxCharactersPerLine = 80, } = options;
    // Set initial column widths
    const colWidths = headerSlugs.map((slug) => slug.length > maxCharactersPerColumn
        ? maxCharactersPerColumn
        : slug.length);
    // Expand column widths if needed
    rows.forEach((row) => {
        headerSlugs.forEach((slug, index) => {
            const cellValue = row[slug];
            if (!cellValue)
                return;
            const length = cellValue.toString().length;
            if (length > colWidths[index])
                colWidths[index] =
                    length > maxCharactersPerColumn
                        ? maxCharactersPerColumn
                        : length;
        });
    });
    // Drop columns if they exceed the max line width
    let runningWidth = 0;
    const finalHeaderSlugs = headerSlugs.filter((slug, index) => {
        runningWidth = runningWidth + colWidths[index];
        if (runningWidth <= maxCharactersPerLine)
            return true;
        return false;
    });
    const cellFn = (cellText = "", row, col) => {
        const width = colWidths[col];
        // Strip newlines in fixedWidth output
        const cellValue = (cellText === null || cellText === void 0 ? void 0 : cellText.toString().replace(/\n/g, "\\n")) || "";
        const cellLength = cellValue.length;
        if (cellLength > width)
            return cellValue.substr(0, width - 3) + "...";
        const padding = " ".repeat(width - cellLength);
        return alignRight ? padding + cellValue : cellValue + padding;
    };
    return ((finalHeaderSlugs.length !== headerSlugs.length
        ? `Showing ${finalHeaderSlugs.length} of ${headerSlugs.length} columns\n`
        : "") + exports.toDelimited(" ", finalHeaderSlugs, rows, cellFn));
};
exports.toAlignedTextTable = toAlignedTextTable;
const toMarkdownTable = (slugs, rows, formatFn) => [
    slugs,
    slugs.map(() => "-"),
    ...rows.map((row) => slugs.map((slug) => row[slug])),
]
    .map((row, rowIndex) => {
    const formattedValues = row.map((val, colIndex) => formatFn ? formatFn(val, rowIndex, colIndex) : val);
    return `|${formattedValues.join("|")}|`;
})
    .join("\n");
exports.toMarkdownTable = toMarkdownTable;
const toDelimited = (delimiter, columnSlugs, rows, cellFn, rowDelimiter = "\n") => {
    const skipHeaderRow = 1;
    const header = columnSlugs.map((columnName, index) => cellFn ? cellFn(columnName, 0, index) : columnName);
    const formattedRows = rows.map((row, rowNumber) => columnSlugs.map((slug, columnIndex) => cellFn
        ? cellFn(row[slug], rowNumber + skipHeaderRow, columnIndex)
        : row[slug]));
    return (header.join(delimiter) +
        rowDelimiter +
        formattedRows.map((row) => row.join(delimiter)).join(rowDelimiter));
};
exports.toDelimited = toDelimited;
//# sourceMappingURL=CoreTablePrinters.js.map