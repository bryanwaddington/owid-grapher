"use strict";
/*
 * Vector utility class
 * Partly based on the Unity vector: https://docs.unity3d.com/ScriptReference/Vector2.html
 * Wraps the Victor library, mainly so we can do type hinting
 *
 * @project Our World In Data
 * @author  Jaiden Mispy
 * @created 2017-03-15
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointVector = void 0;
class PointVector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    subtract(v) {
        return new PointVector(this.x - v.x, this.y - v.y);
    }
    add(v) {
        return new PointVector(this.x + v.x, this.y + v.y);
    }
    times(n) {
        return new PointVector(this.x * n, this.y * n);
    }
    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude > 1e-5)
            return new PointVector(this.x / magnitude, this.y / magnitude);
        return new PointVector(0, 0);
    }
    normals() {
        return [
            new PointVector(-this.y, this.x),
            new PointVector(this.y, -this.x),
        ];
    }
    toString() {
        return `PointVector<${this.x}, ${this.y}>`;
    }
    static distanceSq(a, b) {
        return Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2);
    }
    static distance(a, b) {
        return Math.sqrt(PointVector.distanceSq(a, b));
    }
    static angle(a, b) {
        return (Math.acos(Math.max(Math.min(PointVector.dot(a.normalize(), b.normalize()), 1), -1)) * 57.29578);
    }
    static dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }
    // From: http://stackoverflow.com/a/1501725/1983739
    static distanceFromPointToLineSq(p, v, w) {
        const l2 = PointVector.distanceSq(v, w);
        if (l2 === 0)
            return PointVector.distanceSq(p, v);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return PointVector.distanceSq(p, new PointVector(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
    }
}
exports.PointVector = PointVector;
PointVector.up = new PointVector(0, -1);
PointVector.zero = new PointVector(0, 0);
//# sourceMappingURL=PointVector.js.map