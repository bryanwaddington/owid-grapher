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
exports.runTableOfContents = exports.TableOfContents = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const ReactDOM = __importStar(require("react-dom"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faBars_1 = require("@fortawesome/free-solid-svg-icons/faBars");
const hooks_1 = require("./hooks");
const Util_1 = require("../clientUtils/Util");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const TOC_WRAPPER_CLASSNAME = "toc-wrapper";
const isRecordTopViewport = (record) => {
    return (record.rootBounds &&
        record.boundingClientRect.top < record.rootBounds.height / 2);
};
const getPreviousHeading = (nextHeadingRecord, previousHeadings) => {
    var _a;
    return (_a = previousHeadings.find((heading) => heading.slug === (nextHeadingRecord === null || nextHeadingRecord === void 0 ? void 0 : nextHeadingRecord.target.id))) === null || _a === void 0 ? void 0 : _a.previous;
};
const TableOfContents = ({ headings, pageTitle, hideSubheadings, }) => {
    const [isToggled, setIsToggled] = react_1.useState(false);
    const [isSticky, setIsSticky] = react_1.useState(false);
    const [activeHeading, setActiveHeading] = react_1.useState("");
    const tocRef = react_1.useRef(null);
    const stickySentinelRef = react_1.useRef(null);
    const toggle = () => {
        setIsToggled(!isToggled);
    };
    hooks_1.useTriggerWhenClickOutside(tocRef, isToggled, setIsToggled);
    react_1.useEffect(() => {
        if ("IntersectionObserver" in window) {
            // Sets up an intersection observer to notify when the element with the class
            // `.sticky-sentinel` becomes visible/invisible at the top of the viewport.
            // Inspired by https://developers.google.com/web/updates/2017/09/sticky-headers
            const observer = new IntersectionObserver((records) => {
                for (const record of records) {
                    const targetInfo = record.boundingClientRect;
                    // Started sticking
                    if (targetInfo.top < 0) {
                        setIsSticky(true);
                    }
                    // Stopped sticking
                    if (targetInfo.bottom > 0) {
                        setIsSticky(false);
                    }
                }
            });
            if (stickySentinelRef.current) {
                observer.observe(stickySentinelRef.current);
            }
        }
    }, []);
    react_1.useEffect(() => {
        if ("IntersectionObserver" in window) {
            const previousHeadings = headings.map((heading, i) => ({
                slug: heading.slug,
                previous: i > 0 ? headings[i - 1].slug : null,
            }));
            let currentHeadingRecord;
            let init = true;
            const observer = new IntersectionObserver((records) => {
                let nextHeadingRecord;
                // Target headings going down
                currentHeadingRecord = records.find((record) => 
                // filter out records no longer intersecting (triggering on exit)
                record.isIntersecting &&
                    // filter out records fully in the page (upcoming section)
                    record.intersectionRatio !== 1 &&
                    // filter out intersections happening at the bottom of the viewport
                    isRecordTopViewport(record));
                if (currentHeadingRecord) {
                    setActiveHeading(currentHeadingRecord.target.id);
                }
                else {
                    // Target headings going up
                    nextHeadingRecord = records.find((record) => isRecordTopViewport(record) &&
                        record.intersectionRatio === 1);
                    if (nextHeadingRecord) {
                        setActiveHeading(getPreviousHeading(nextHeadingRecord, previousHeadings) || "");
                    }
                    else if (init) {
                        currentHeadingRecord = records
                            .reverse()
                            .find((record) => record.boundingClientRect.top < 0);
                        setActiveHeading((currentHeadingRecord === null || currentHeadingRecord === void 0 ? void 0 : currentHeadingRecord.target.id) || "");
                    }
                }
                init = false;
            }, {
                rootMargin: "-10px",
                threshold: new Array(11).fill(0).map((v, i) => i / 10),
            });
            let contentHeadings = null;
            if (hideSubheadings) {
                contentHeadings = document.querySelectorAll("h2");
            }
            else {
                contentHeadings = document.querySelectorAll("h2, h3");
            }
            contentHeadings.forEach((contentHeading) => {
                observer.observe(contentHeading);
            });
        }
    }, []);
    return (React.createElement("div", { className: TOC_WRAPPER_CLASSNAME },
        React.createElement("aside", { className: `entry-sidebar${isToggled ? " toggled" : ""}${isSticky ? " sticky" : ""}`, ref: tocRef },
            React.createElement("div", { className: "sticky-sentinel", ref: stickySentinelRef }),
            React.createElement("nav", { className: "entry-toc" },
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement("a", { onClick: () => {
                                toggle();
                                setActiveHeading("");
                            }, href: "#", "data-track-note": "toc-header" }, pageTitle)),
                    headings
                        .filter((heading) => hideSubheadings && heading.isSubheading
                        ? false
                        : true)
                        .map((heading, i) => (React.createElement("li", { key: i, className: (heading.isSubheading
                            ? "subsection"
                            : "section") +
                            (heading.slug === activeHeading
                                ? " active"
                                : "") },
                        React.createElement("a", { onClick: toggle, href: `#${heading.slug}`, "data-track-note": "toc-link" }, heading.text)))))),
            React.createElement("div", { className: "toggle-toc" },
                React.createElement("button", { "data-track-note": "page-toggle-toc", "aria-label": `${isToggled ? "Close" : "Open"} table of contents`, onClick: toggle },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: isToggled ? faTimes_1.faTimes : faBars_1.faBars }),
                    React.createElement("span", { className: "label" }, isToggled ? "Close" : "Contents"))))));
};
exports.TableOfContents = TableOfContents;
const runTableOfContents = (tocData) => {
    const tocWrapperEl = document.querySelector(`.${TOC_WRAPPER_CLASSNAME}`);
    if (!tocWrapperEl)
        return;
    const sidebarRootEl = Util_1.wrapInDiv(tocWrapperEl, ["sidebar-root"]);
    ReactDOM.hydrate(React.createElement(exports.TableOfContents, Object.assign({}, tocData)), sidebarRootEl);
};
exports.runTableOfContents = runTableOfContents;
//# sourceMappingURL=TableOfContents.js.map