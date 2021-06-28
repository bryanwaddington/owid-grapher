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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployStatusPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const timeago_js_1 = require("timeago.js");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCheckCircle_1 = require("@fortawesome/free-solid-svg-icons/faCheckCircle");
const AdminLayout_1 = require("./AdminLayout");
const AdminAppContext_1 = require("./AdminAppContext");
const owidTypes_1 = require("../clientUtils/owidTypes");
const statusLabel = {
    [owidTypes_1.DeployStatus.queued]: "Next up",
    [owidTypes_1.DeployStatus.pending]: "Deploying",
};
let DeployStatusPage = class DeployStatusPage extends React.Component {
    constructor() {
        super(...arguments);
        this.deploys = [];
    }
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Deploys" },
            React.createElement("main", { className: "DeploysPage" },
                React.createElement("h1", null, "Deploy status"),
                this.deploys.length > 0 ? (React.createElement("table", { className: "DeploysTable" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null, "Note"),
                            React.createElement("th", null, "Author"),
                            React.createElement("th", null, "Time"))),
                    React.createElement("tbody", null, this.deploys.map((deploy) => deploy.changes.map((change, i) => (React.createElement("tr", { key: `${deploy.status}-${i}` },
                        React.createElement("td", { className: `cell-status cell-status--${deploy.status}` }, statusLabel[deploy.status]),
                        React.createElement("td", { className: "cell-message" }, change.message),
                        React.createElement("td", { className: "cell-author" }, change.authorName),
                        React.createElement("td", { className: "cell-time" }, change.timeISOString
                            ? timeago_js_1.format(Date.parse(change.timeISOString))
                            : "")))))))) : (React.createElement("div", { className: "all-published-notice" },
                    React.createElement("p", null,
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCheckCircle_1.faCheckCircle })),
                        " ",
                        "All changes are successfully deployed."))),
                React.createElement("p", null,
                    "Past deploys can be found in the",
                    " ",
                    React.createElement("a", { href: "https://github.com/owid/owid-static/commits/master", target: "_blank", rel: "noopener noreferrer" },
                        React.createElement("strong", null, "owid-static"),
                        " GitHub repository"),
                    "."))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            if (admin.currentRequests.length > 0)
                return;
            const json = (yield admin.getJSON("/api/deploys.json"));
            mobx_1.runInAction(() => {
                this.deploys = json.deploys;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
DeployStatusPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], DeployStatusPage.prototype, "deploys", void 0);
DeployStatusPage = __decorate([
    mobx_react_1.observer
], DeployStatusPage);
exports.DeployStatusPage = DeployStatusPage;
//# sourceMappingURL=DeployStatusPage.js.map