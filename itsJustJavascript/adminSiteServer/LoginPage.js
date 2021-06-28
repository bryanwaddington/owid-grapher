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
exports.LoginPage = void 0;
const React = __importStar(require("react"));
const LoginPage = (props) => {
    const style = `
        html, body {
            height: 100%;
        }

        body {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        h1 {
            margin-bottom: 0.4em;
        }

        button {
            cursor: pointer;
        }
    `;
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("title", null, "owid-admin"),
            React.createElement("meta", { name: "description", content: "" }),
            React.createElement("link", { rel: "stylesheet", href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" }),
            React.createElement("style", null, style)),
        React.createElement("body", null,
            React.createElement("form", { method: "POST" },
                React.createElement("h1", null, "owid-admin"),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Email address"),
                    React.createElement("input", { name: "username", type: "email", className: "form-control", placeholder: "Enter email", required: true })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Password"),
                    React.createElement("input", { name: "password", type: "password", className: "form-control", placeholder: "Password", required: true })),
                React.createElement("input", { type: "hidden", name: "next", value: props.next }),
                props.errorMessage && (React.createElement("div", { className: "alert alert-danger" }, props.errorMessage)),
                React.createElement("p", null,
                    "Having trouble logging in? Go to",
                    " ",
                    React.createElement("a", { href: "https://owid.slack.com/messages/tech-issues/" }, "#tech-issues"),
                    "."),
                React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Login")))));
};
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map