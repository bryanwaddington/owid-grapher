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
exports.AdminSidebar = void 0;
const Link_1 = require("./Link");
const React = __importStar(require("react"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faChartBar_1 = require("@fortawesome/free-solid-svg-icons/faChartBar");
const faFile_1 = require("@fortawesome/free-solid-svg-icons/faFile");
const faUpload_1 = require("@fortawesome/free-solid-svg-icons/faUpload");
const faTable_1 = require("@fortawesome/free-solid-svg-icons/faTable");
const faDatabase_1 = require("@fortawesome/free-solid-svg-icons/faDatabase");
const faGlobe_1 = require("@fortawesome/free-solid-svg-icons/faGlobe");
const faTag_1 = require("@fortawesome/free-solid-svg-icons/faTag");
const faUser_1 = require("@fortawesome/free-solid-svg-icons/faUser");
const faArrowRight_1 = require("@fortawesome/free-solid-svg-icons/faArrowRight");
const faEye_1 = require("@fortawesome/free-solid-svg-icons/faEye");
const faCoffee_1 = require("@fortawesome/free-solid-svg-icons/faCoffee");
const faNewspaper_1 = require("@fortawesome/free-solid-svg-icons/faNewspaper");
const faBook_1 = require("@fortawesome/free-solid-svg-icons/faBook");
const faSatelliteDish_1 = require("@fortawesome/free-solid-svg-icons/faSatelliteDish");
const AdminSidebar = () => (React.createElement("aside", { className: "AdminSidebar" },
    React.createElement("ul", { className: "sidebar-menu" },
        React.createElement("li", { className: "header" }, "SITE"),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/charts" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faChartBar_1.faChartBar }),
                " Charts")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/posts" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faFile_1.faFile }),
                " Posts")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/explorers" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCoffee_1.faCoffee }),
                " Explorers")),
        React.createElement("li", { className: "header" }, "DATA"),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/import" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faUpload_1.faUpload }),
                " Import CSV")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/datasets" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTable_1.faTable }),
                " Datasets")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/variables" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDatabase_1.faDatabase }),
                " Variables")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/standardize" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faGlobe_1.faGlobe }),
                " Country tool")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/tags" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTag_1.faTag }),
                " Tags")),
        React.createElement("li", { className: "header" }, "SETTINGS"),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/users/" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faUser_1.faUser }),
                " Users")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/redirects" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faArrowRight_1.faArrowRight }),
                " Redirects")),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/test" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faEye_1.faEye }),
                " Test")),
        React.createElement("li", null,
            React.createElement("a", { href: "https://owid.github.io/stories/", target: "_blank", rel: "noopener" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faBook_1.faBook }),
                " Storybook")),
        React.createElement("li", { className: "header" }, "UTILITIES"),
        React.createElement("li", null,
            React.createElement(Link_1.Link, { to: "/deploys" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSatelliteDish_1.faSatelliteDish }),
                " Deploy status"),
            React.createElement(Link_1.Link, { to: "/newsletter" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faNewspaper_1.faNewspaper }),
                " Newsletter")))));
exports.AdminSidebar = AdminSidebar;
//# sourceMappingURL=AdminSidebar.js.map