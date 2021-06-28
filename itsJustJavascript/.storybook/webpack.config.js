"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const configAdjuster = ({ config }) => {
    // baseDir is necessary to make webpack.config.ts use the correct path both in TS as well as in
    // transpiled JS form
    let baseDir = path.resolve(__dirname, "..");
    baseDir =
        path.basename(baseDir) === "itsJustJavascript"
            ? path.resolve(baseDir, "..")
            : baseDir;
    const javascriptDir = path.resolve(baseDir, "itsJustJavascript");
    config.module.rules = config.module.rules.concat([
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader?url=false",
                "sass-loader",
            ],
        },
    ]);
    config.plugins = config.plugins.concat([
        new MiniCssExtractPlugin({ filename: "[name].css" }),
    ]);
    config.node = {
        // This is needed so Webpack ignores "dotenv" imports in bundled code
        fs: "empty",
    };
    config.resolve.modules = ["node_modules", javascriptDir, baseDir]; // baseDir is required for resolving *.scss files
    return config;
};
exports.default = configAdjuster;
//# sourceMappingURL=webpack.config.js.map