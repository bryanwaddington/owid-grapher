"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComparisonLinePoints = void 0;
const expr_eval_1 = require("expr-eval");
const d3_scale_1 = require("d3-scale");
const GrapherConstants_1 = require("../core/GrapherConstants");
function generateComparisonLinePoints(lineFunction = "x", xScaleDomain, yScaleDomain, xScaleType, yScaleType) {
    var _a;
    const expr = (_a = parseEquation(lineFunction)) === null || _a === void 0 ? void 0 : _a.simplify({
        e: Math.E,
        pi: Math.PI,
    });
    const yFunc = (x) => evalExpression(expr, { x }, undefined);
    // Construct control data by running the equation across sample points
    const numPoints = 500;
    const scaleFunction = xScaleType === GrapherConstants_1.ScaleType.log ? d3_scale_1.scaleLog : d3_scale_1.scaleLinear;
    const scale = scaleFunction().domain(xScaleDomain).range([0, numPoints]);
    const controlData = [];
    for (let i = 0; i < numPoints; i++) {
        const x = scale.invert(i);
        const y = yFunc(x);
        if (y === undefined || Number.isNaN(x) || Number.isNaN(y))
            continue;
        if (xScaleType === GrapherConstants_1.ScaleType.log && x <= 0)
            continue;
        if (yScaleType === GrapherConstants_1.ScaleType.log && y <= 0)
            continue;
        if (y > yScaleDomain[1])
            continue;
        controlData.push([x, y]);
    }
    return controlData;
}
exports.generateComparisonLinePoints = generateComparisonLinePoints;
function evalExpression(expr, context, defaultOnError) {
    if (expr === undefined)
        return defaultOnError;
    try {
        return expr.evaluate(context);
    }
    catch (e) {
        return defaultOnError;
    }
}
function parseEquation(equation) {
    try {
        return expr_eval_1.Parser.parse(equation);
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
}
//# sourceMappingURL=ComparisonLineGenerator.js.map