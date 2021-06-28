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
exports.RegisterPage = void 0;
const React = __importStar(require("react"));
const RegisterPage = (props) => {
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
                React.createElement("p", null,
                    "Register an account to access the",
                    " ",
                    React.createElement("a", { href: "https://ourworldindata.org" }, "ourworldindata.org"),
                    " ",
                    "database and chart editor."),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Email"),
                    React.createElement("input", { name: "email", type: "email", className: "form-control", placeholder: "Email", required: true, value: props.body.email || props.inviteEmail })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Name"),
                    React.createElement("input", { name: "fullName", className: "form-control", placeholder: "Full name", required: true, value: props.body.fullName })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Password"),
                    React.createElement("input", { name: "password", type: "password", className: "form-control", placeholder: "Password", required: true, value: props.body.password })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Confirm Password"),
                    React.createElement("input", { name: "confirmPassword", type: "password", className: "form-control", placeholder: "Password", required: true, value: props.body.confirmPassword })),
                React.createElement("input", { type: "hidden", name: "code", value: props.body.code }),
                props.errorMessage && (React.createElement("div", { className: "alert alert-danger" }, props.errorMessage)),
                React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Register")))));
};
exports.RegisterPage = RegisterPage;
//# sourceMappingURL=RegisterPage.js.map