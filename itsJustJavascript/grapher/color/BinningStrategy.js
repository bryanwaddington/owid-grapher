"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinningStrategy = void 0;
var BinningStrategy;
(function (BinningStrategy) {
    BinningStrategy["equalInterval"] = "equalInterval";
    BinningStrategy["quantiles"] = "quantiles";
    BinningStrategy["ckmeans"] = "ckmeans";
    // The `manual` option is ignored in the algorithms below,
    // but it is stored and handled by the chart.
    BinningStrategy["manual"] = "manual";
})(BinningStrategy = exports.BinningStrategy || (exports.BinningStrategy = {}));
//# sourceMappingURL=BinningStrategy.js.map