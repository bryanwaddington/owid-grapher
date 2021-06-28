"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStylesForTargetHeight = exports.asArray = void 0;
const isMultiValue = (value) => Array.isArray(value);
const asArray = (value) => {
    if (value == null)
        return [];
    if (isMultiValue(value))
        return Array.from(value);
    return [value];
};
exports.asArray = asArray;
const getStylesForTargetHeight = (targetHeight, props = {}) => {
    // Taken from https://github.com/JedWatson/react-select/issues/1322#issuecomment-591189551
    const { control, valueContainer, singleValue, clearIndicator, container, dropdownIndicator, option, menu, } = props;
    return {
        container: (base) => (Object.assign(Object.assign({}, base), container)),
        control: (base) => (Object.assign(Object.assign(Object.assign({}, base), { minHeight: "initial" }), control)),
        valueContainer: (base) => (Object.assign(Object.assign(Object.assign({}, base), { height: `${targetHeight - 1 - 1}px`, padding: "0 4px", flexWrap: "nowrap" }), valueContainer)),
        singleValue: (base) => (Object.assign(Object.assign({}, base), singleValue)),
        clearIndicator: (base) => (Object.assign(Object.assign(Object.assign({}, base), { padding: `${(targetHeight - 20 - 1 - 1) / 2}px` }), clearIndicator)),
        dropdownIndicator: (base) => (Object.assign(Object.assign(Object.assign({}, base), { padding: `${(targetHeight - 20 - 1 - 1) / 2}px` }), dropdownIndicator)),
        option: (base) => (Object.assign(Object.assign(Object.assign({}, base), { paddingTop: "5px", paddingBottom: "5px" }), option)),
        menu: (base) => (Object.assign(Object.assign(Object.assign({}, base), { zIndex: 10000 }), menu)),
    };
};
exports.getStylesForTargetHeight = getStylesForTargetHeight;
//# sourceMappingURL=react-select.js.map