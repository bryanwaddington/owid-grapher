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
exports.EditorFAQ = void 0;
const React = __importStar(require("react"));
const Forms_1 = require("./Forms");
const faLink_1 = require("@fortawesome/free-solid-svg-icons/faLink");
const faUnlink_1 = require("@fortawesome/free-solid-svg-icons/faUnlink");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
class EditorFAQ extends React.Component {
    render() {
        return (React.createElement(Forms_1.Modal, { onClose: this.props.onClose, className: "EditorFAQ" },
            React.createElement("div", { className: "modal-header" },
                React.createElement("h3", { className: "modal-title" }, "Frequently Asked Questions")),
            React.createElement("div", { className: "modal-body" },
                React.createElement("h6", null, "How do I make a chart?"),
                React.createElement("p", null,
                    "See this",
                    " ",
                    React.createElement("a", { target: "_blank", rel: "noopener", href: "https://ourworldindata.org/how-to-our-world-in-data-guide/#owid-grapher" }, "more in depth guide"),
                    " ",
                    "for the full process."),
                React.createElement("h6", null, "What are \"variables\" and \"entities\"?"),
                React.createElement("p", null, "They roughly correspond to columns and rows in a CSV file. For OWID, entities are usually but not always countries."),
                React.createElement("h6", null, "What do the little icons mean?"),
                React.createElement("p", null,
                    "If you see the ",
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faLink_1.faLink }),
                    " link icon, it means a field is currently linked to the database and has its default value. By changing that field you break the link",
                    " ",
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faUnlink_1.faUnlink }),
                    " and set manual input for this particular chart."),
                React.createElement("h6", null, "When are charts updated?"),
                React.createElement("p", null, "The version of the chart you see in the editor is always the most current version. When published, charts are bundled together in a static build process and sent to Netlify for distribution around the world. This means it may take a few minutes for the live version to be updated."),
                React.createElement("p", null, "The public version of a chart is not (currently) updated automatically when new data is uploaded. You may need to click \"update chart\" to have data changes reflected publicly."),
                React.createElement("p", null,
                    "You can check the publication status and history in the",
                    " ",
                    React.createElement("a", { href: "https://owid.slack.com/messages/changelog/" }, "#changelog"),
                    " ",
                    "channel."),
                React.createElement("h6", null, "How much data can I put in one chart?"),
                React.createElement("p", null,
                    "The fewer variables the better. To allow for fast interactivity, the grapher preloads ",
                    React.createElement("strong", null, "all"),
                    " ",
                    "the data for each variable added to a chart, including every year and entity. If you have 10+ big variables on one chart it may be a little slow to load."),
                React.createElement("p", null, "Similarly, if you select many entities or have very long subtitles the chart will become visually cluttered. Make sure there's enough room for the chart to work well in the mobile preview, and if in doubt make two smaller charts rather than one big one."),
                React.createElement("h6", null, "Why does it say \"No matching data\"?"),
                React.createElement("p", null, "Check the data selection on the \"Data\" tab and the specified year range on the \"Customize\" tab. Alternatively, you might be trying to show a categorical variable on a numeric chart type or vice versa, which won't work."),
                React.createElement("h6", null, "Other questions or bug reports"),
                React.createElement("p", null,
                    "Fastest way to get support is to ask in",
                    " ",
                    React.createElement("a", { href: "https://owid.slack.com/messages/tech-issues/" }, "#tech-issues"),
                    " ",
                    "on the OWID Slack!"))));
    }
}
exports.EditorFAQ = EditorFAQ;
//# sourceMappingURL=EditorFAQ.js.map