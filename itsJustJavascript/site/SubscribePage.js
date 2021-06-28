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
exports.SubscribePage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SubscribePage = (props) => {
    const style = `
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        main {
            max-width: 1080px;
            padding: 40px 20px;
            margin: auto;
            min-height: 0;
        }
        h1 {
            line-height: 1.1em;
        }

        input[type=email] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
        }

        input[type=submit] {
            margin-top: 10px;
            background: #5d5d5d;
            color: #fff;
            padding: 10px 22px;
            cursor: pointer;
        }
    `;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { pageTitle: "Subscribe", canonicalUrl: `${props.baseUrl}/subscribe`, baseUrl: props.baseUrl },
            React.createElement("style", { dangerouslySetInnerHTML: { __html: style } })),
        React.createElement("body", { className: "SubscribePage" },
            React.createElement("main", null,
                React.createElement("h1", null, "Subscribe to Our World in Data"),
                React.createElement("p", null, "Want to keep up with new data? Sign up for email updates."),
                React.createElement("form", { action: "https://ourworldindata.us8.list-manage.com/subscribe/post?u=18058af086319ba6afad752ec&id=2e166c1fc1", method: "post", id: "mc-embedded-subscribe-form", name: "mc-embedded-subscribe-form", target: "_blank" },
                    React.createElement("input", { type: "email", placeholder: "Email", name: "EMAIL", className: "required email", id: "mce-EMAIL", "aria-label": "Email" }),
                    React.createElement("input", { type: "submit", value: "Subscribe", name: "subscribe", id: "mc-embedded-subscribe", className: "button" }),
                    React.createElement("div", { style: { position: "absolute", left: "-5000px" } },
                        React.createElement("input", { type: "text", name: "b_18058af086319ba6afad752ec_2e166c1fc1", tabIndex: -1 }))),
                React.createElement("p", null,
                    "You can also subscribe using our",
                    " ",
                    React.createElement("a", { href: "/feed" }, "RSS feed"),
                    ".")))));
};
exports.SubscribePage = SubscribePage;
//# sourceMappingURL=SubscribePage.js.map