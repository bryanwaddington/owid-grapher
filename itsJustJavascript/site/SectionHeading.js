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
exports.SectionHeading = void 0;
const React = __importStar(require("react"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faArrowDown_1 = require("@fortawesome/free-solid-svg-icons/faArrowDown");
const SectionHeading = ({ title, tocHeadings, children, }) => {
    const sectionHeadingIdx = tocHeadings.findIndex((heading) => !heading.isSubheading && heading.text === title);
    const subHeadings = [];
    for (let i = sectionHeadingIdx + 1; i < tocHeadings.length; i++) {
        if (tocHeadings[i].isSubheading === true) {
            subHeadings.push(tocHeadings[i]);
        }
        else {
            break;
        }
    }
    return (React.createElement("div", { className: "section-heading" },
        React.createElement("div", { className: "wrapper" },
            children,
            subHeadings.length !== 0 && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "in-this-section" },
                    React.createElement("div", { className: "label" }, "In this section"),
                    React.createElement("div", { className: "border" })),
                React.createElement("ul", { className: "subheadings" }, subHeadings.map((subHeading) => (React.createElement("li", { key: subHeading.slug },
                    React.createElement("a", { href: `#${subHeading.slug}` },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faArrowDown_1.faArrowDown }),
                        subHeading.html ? (React.createElement("span", { dangerouslySetInnerHTML: {
                                __html: subHeading.html,
                            } })) : (subHeading.text)))))))))));
};
exports.SectionHeading = SectionHeading;
//# sourceMappingURL=SectionHeading.js.map