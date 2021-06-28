"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoricalBin = exports.NumericBin = void 0;
class AbstractColorScaleBin {
    constructor(props) {
        this.props = props;
    }
    get color() {
        return this.props.color;
    }
    get label() {
        return this.props.label;
    }
}
class NumericBin extends AbstractColorScaleBin {
    get min() {
        return this.props.min;
    }
    get max() {
        return this.props.max;
    }
    get minText() {
        return (this.props.isOpenLeft ? `<` : "") + this.props.displayMin;
    }
    get maxText() {
        return (this.props.isOpenRight ? `>` : "") + this.props.displayMax;
    }
    get text() {
        return this.props.label || "";
    }
    get isHidden() {
        return false;
    }
    contains(value) {
        if (value === undefined)
            return false;
        if (this.props.isOpenLeft)
            return value <= this.max;
        if (this.props.isOpenRight)
            return value > this.min;
        if (this.props.isFirst)
            return value >= this.min && value <= this.max;
        return value > this.min && value <= this.max;
    }
    equals(other) {
        return (other instanceof NumericBin &&
            this.min === other.min &&
            this.max === other.max);
    }
}
exports.NumericBin = NumericBin;
class CategoricalBin extends AbstractColorScaleBin {
    get index() {
        return this.props.index;
    }
    get value() {
        return this.props.value;
    }
    get isHidden() {
        return this.props.isHidden;
    }
    get text() {
        return this.props.label || this.props.value;
    }
    contains(value) {
        return ((value === undefined && this.props.value === "No data") ||
            (value !== undefined && value === this.props.value));
    }
    equals(other) {
        return (other instanceof CategoricalBin &&
            this.props.index === other.props.index);
    }
}
exports.CategoricalBin = CategoricalBin;
//# sourceMappingURL=ColorScaleBin.js.map