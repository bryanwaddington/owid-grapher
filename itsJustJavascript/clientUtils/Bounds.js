"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BOUNDS = exports.Bounds = void 0;
const Util_1 = require("./Util");
const PointVector_1 = require("./PointVector");
const string_pixel_width_1 = __importDefault(require("string-pixel-width"));
// Important utility class for all visualizations
// Since we want to be able to render charts headlessly and functionally, we
// can't rely on the DOM to do these calculations for us, and instead must
// calculate using geometry and first principles
class Bounds {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = Math.max(width, 0);
        this.height = Math.max(height, 0);
    }
    static fromProps(props) {
        const { x, y, width, height } = props;
        return new Bounds(x, y, width, height);
    }
    static fromBBox(bbox) {
        return this.fromProps(bbox);
    }
    static fromRect(rect) {
        return new Bounds(rect.left, rect.top, rect.width, rect.height);
    }
    static fromElement(el) {
        return Bounds.fromRect(el.getBoundingClientRect());
    }
    static fromCorners(p1, p2) {
        const x1 = Math.min(p1.x, p2.x);
        const x2 = Math.max(p1.x, p2.x);
        const y1 = Math.min(p1.y, p2.y);
        const y2 = Math.max(p1.y, p2.y);
        return new Bounds(x1, y1, x2 - x1, y2 - y1);
    }
    // Merge a collection of bounding boxes into a single encompassing Bounds
    static merge(boundsList) {
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
        for (const b of boundsList) {
            x1 = Math.min(x1, b.x);
            y1 = Math.min(y1, b.y);
            x2 = Math.max(x2, b.x + b.width);
            y2 = Math.max(y2, b.y + b.height);
        }
        return Bounds.fromCorners(new PointVector_1.PointVector(x1, y1), new PointVector_1.PointVector(x2, y2));
    }
    static getRightShiftForMiddleAlignedTextIfNeeded(label, fontSize, xPosition) {
        const bounds = Bounds.forText(label, {
            fontSize,
        });
        const overflow = xPosition - Math.ceil(bounds.width / 2);
        return overflow < 0 ? Math.abs(overflow) : 0;
    }
    static empty() {
        return new Bounds(0, 0, 0, 0);
    }
    static forText(str = "", { x = 0, y = 0, fontSize = 16, fontWeight = 400, } = {}) {
        // Collapse contiguous spaces into one
        str = str.replace(/ +/g, " ");
        const isBold = fontWeight >= 600;
        let bounds = Bounds.empty();
        if (str) {
            // pixelWidth uses a precomputed character width table to quickly give a
            // rough estimate of string width based on characters in a string - it is probably not
            // worth caching further
            const width = string_pixel_width_1.default(str, {
                font: "arial",
                size: fontSize,
                bold: isBold,
            });
            const height = fontSize;
            bounds = new Bounds(x, y - height, width, height);
        }
        return bounds;
    }
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y + this.height;
    }
    get centerX() {
        return this.x + this.width / 2;
    }
    get centerY() {
        return this.y + this.height / 2;
    }
    get centerPos() {
        return new PointVector_1.PointVector(this.centerX, this.centerY);
    }
    get area() {
        return this.width * this.height;
    }
    get topLeft() {
        return new PointVector_1.PointVector(this.left, this.top);
    }
    get topRight() {
        return new PointVector_1.PointVector(this.right, this.top);
    }
    get bottomLeft() {
        return new PointVector_1.PointVector(this.left, this.bottom);
    }
    get bottomRight() {
        return new PointVector_1.PointVector(this.right, this.bottom);
    }
    padLeft(amount) {
        return new Bounds(this.x + amount, this.y, this.width - amount, this.height);
    }
    padRight(amount) {
        return new Bounds(this.x, this.y, this.width - amount, this.height);
    }
    padBottom(amount) {
        return new Bounds(this.x, this.y, this.width, this.height - amount);
    }
    padTop(amount) {
        return new Bounds(this.x, this.y + amount, this.width, this.height - amount);
    }
    padWidth(amount) {
        return new Bounds(this.x + amount, this.y, this.width - amount * 2, this.height);
    }
    padHeight(amount) {
        return new Bounds(this.x, this.y + amount, this.width, this.height - amount * 2);
    }
    fromLeft(amount) {
        return this.padRight(this.width - amount);
    }
    fromBottom(amount) {
        return this.padTop(this.height - amount);
    }
    pad(amount) {
        return new Bounds(this.x + amount, this.y + amount, this.width - amount * 2, this.height - amount * 2);
    }
    extend(props) {
        return Bounds.fromProps(Object.assign(Object.assign({}, this), props));
    }
    scale(scale) {
        return new Bounds(this.x * scale, this.y * scale, this.width * scale, this.height * scale);
    }
    intersects(otherBounds) {
        const r1 = this;
        const r2 = otherBounds;
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
    lines() {
        return [
            [this.topLeft, this.topRight],
            [this.topRight, this.bottomRight],
            [this.bottomRight, this.bottomLeft],
            [this.bottomLeft, this.topLeft],
        ];
    }
    boundedPoint(p) {
        return new PointVector_1.PointVector(Math.max(Math.min(p.x, this.right), this.left), Math.max(Math.min(p.y, this.bottom), this.top));
    }
    containsPoint(x, y) {
        return (x >= this.left &&
            x <= this.right &&
            y >= this.top &&
            y <= this.bottom);
    }
    contains(p) {
        return this.containsPoint(p.x, p.y);
    }
    encloses(bounds) {
        return (this.containsPoint(bounds.left, bounds.top) &&
            this.containsPoint(bounds.left, bounds.bottom) &&
            this.containsPoint(bounds.right, bounds.top) &&
            this.containsPoint(bounds.right, bounds.bottom));
    }
    toCSS() {
        return {
            left: `${this.left}px`,
            top: `${this.top}px`,
            width: `${this.width}px`,
            height: `${this.height}px`,
        };
    }
    toProps() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
    toArray() {
        return [
            [this.left, this.top],
            [this.right, this.bottom],
        ];
    }
    xRange() {
        return [this.left, this.right];
    }
    split(pieces, padding = {}) {
        // Splits a rectangle into smaller rectangles.
        // The Facet Storybook has a visual demo of how this works.
        // I form the smallest possible square and then fill that up. This always goes left to right, top down.
        // So when we don't have a round number we first add a column, then a row, etc, until we reach the next square.
        // In the future we may want to position these bounds in custom ways, but this only does basic splitting for now.
        // NB: The off-by-one-pixel scenarios have NOT yet been unit tested. Karma points for the person who adds those tests and makes
        // any required adjustments.
        const { columnPadding = 0, rowPadding = 0, outerPadding = 0 } = padding;
        const { columns, rows } = Util_1.makeGrid(pieces);
        const contentWidth = this.width - columnPadding * (columns - 1) - outerPadding * 2;
        const contentHeight = this.height - rowPadding * (rows - 1) - outerPadding * 2;
        const boxWidth = Math.floor(contentWidth / columns);
        const boxHeight = Math.floor(contentHeight / rows);
        return Util_1.range(0, pieces).map((index) => new Bounds(outerPadding +
            (index % columns) * (boxWidth + columnPadding), outerPadding +
            Math.floor(index / columns) * (boxHeight + rowPadding), boxWidth, boxHeight));
    }
    yRange() {
        return [this.bottom, this.top];
    }
    equals(bounds) {
        return (this.x === bounds.x &&
            this.y === bounds.y &&
            this.width === bounds.width &&
            this.height === bounds.height);
    }
    // Calculate squared distance between a given point and the closest border of the bounds
    // If the point is within the bounds, returns 0
    distanceToPointSq(p) {
        if (this.contains(p))
            return 0;
        const cx = Math.max(Math.min(p.x, this.x + this.width), this.x);
        const cy = Math.max(Math.min(p.y, this.y + this.height), this.y);
        return (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
    }
    distanceToPoint(p) {
        return Math.sqrt(this.distanceToPointSq(p));
    }
}
exports.Bounds = Bounds;
// Since nearly all our components need a bounds, but most tests don't care about bounds, have a default bounds
// to use so we don't have to create a bounds for every test.
exports.DEFAULT_BOUNDS = new Bounds(0, 0, 640, 480);
//# sourceMappingURL=Bounds.js.map