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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrate = exports.render = exports.CLASS_NAME = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const ReactDOM = __importStar(require("react-dom"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const react_animate_height_1 = __importDefault(require("react-animate-height"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faAngleRight_1 = require("@fortawesome/free-solid-svg-icons/faAngleRight");
const MultiEmbedder_1 = require("../../site/multiembedder/MultiEmbedder");
exports.CLASS_NAME = "wp-block-owid-additional-information";
const VARIATION_MERGE_LEFT = "merge-left";
const VARIATION_FULL_WIDTH = "full-width";
/*
 * This block has 2 variations (on large screens):
 * 1- merge left, with or without image.
 * 2- full width, with its content using the usual automatic layout
 *
 * For both these variations, the title is optional and is
 * assumed to be contained in the first h3 tag.
 */
const AdditionalInformation = ({ content, title, image, variation, defaultOpen, }) => {
    const [height, setHeight] = react_1.useState(defaultOpen ? "auto" : 0);
    const [hasBeenOpened, setHasBeenOpened] = react_1.useState(defaultOpen);
    const refContainer = react_1.useRef(null);
    const classes = [exports.CLASS_NAME];
    react_1.useEffect(() => {
        if (refContainer.current) {
            // Trigger embedder check for new figures that may have become visible.
            MultiEmbedder_1.MultiEmbedderSingleton.observeFigures(refContainer.current);
        }
        // Expands accordions for print media.
        window.addEventListener("beforeprint", () => {
            onOpenHandler();
        });
    }, [hasBeenOpened]);
    const onClickHandler = () => {
        setHeight(height === 0 ? "auto" : 0);
        if (!hasBeenOpened) {
            setHasBeenOpened(true);
        }
    };
    const onOpenHandler = () => {
        setHeight("auto");
        if (!hasBeenOpened) {
            setHasBeenOpened(true);
        }
    };
    if (image) {
        classes.push("with-image");
    }
    if (height !== 0) {
        classes.push("open");
    }
    const renderFullWidthVariation = () => {
        return (React.createElement("div", { className: "content", dangerouslySetInnerHTML: { __html: content || "" } }));
    };
    const renderMergeLeftVariation = () => {
        return (React.createElement("div", { className: "content-wrapper" },
            image ? (React.createElement("figure", { dangerouslySetInnerHTML: { __html: image || "" } })) : null,
            React.createElement("div", { className: "content", dangerouslySetInnerHTML: { __html: content || "" } })));
    };
    return (React.createElement("div", { "data-variation": variation, "data-default-open": defaultOpen, ref: refContainer, className: classes.join(" ") },
        React.createElement("h3", { onClick: onClickHandler, "data-track-note": "additional-information-toggle" },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleRight_1.faAngleRight }),
            title),
        React.createElement(react_animate_height_1.default, { height: height, animateOpacity: true }, variation === VARIATION_MERGE_LEFT
            ? renderMergeLeftVariation()
            : renderFullWidthVariation())));
};
exports.default = AdditionalInformation;
const render = ($) => {
    $("block[type='additional-information']").each(function () {
        const $block = $(this);
        const variation = $block.find(".is-style-merge-left").length
            ? VARIATION_MERGE_LEFT
            : VARIATION_FULL_WIDTH;
        const title = $block.find("h3").remove().text() || "Additional information";
        const image = variation === VARIATION_MERGE_LEFT
            ? $block
                .find(".wp-block-column:first-child img[src]") // Wordpress outputs empty <img> tags when none is selected so we need to filter those out
                .first()
                .parent() // Get the wrapping <figure>
                .html()
            : null;
        const content = variation === VARIATION_MERGE_LEFT
            ? $block.find(".wp-block-column:last-child").html()
            : $block.find("content").html(); // the title has been removed so the rest of a variation "full width" block is content.
        // Side note: "content" refers here to the <content> tag output by the block on the PHP side, not
        // the ".content" class.
        const defaultOpen = $block.attr("default-open") === "true";
        const rendered = ReactDOMServer.renderToString(React.createElement("div", { className: "block-wrapper" },
            React.createElement(AdditionalInformation, { content: content, title: title, image: image, variation: variation, defaultOpen: defaultOpen })));
        $block.after(rendered);
        $block.remove();
    });
};
exports.render = render;
const hydrate = () => {
    document
        .querySelectorAll(`.${exports.CLASS_NAME}`)
        .forEach((block) => {
        const blockWrapper = block.parentElement;
        const titleEl = block.querySelector("h3");
        const title = titleEl ? titleEl.textContent : null;
        const variation = block.getAttribute("data-variation") || "";
        const defaultOpen = block.getAttribute("data-default-open") === "true";
        const figureEl = block.querySelector(".content-wrapper > figure");
        const image = figureEl ? figureEl.innerHTML : null;
        const contentEl = block.querySelector(".content");
        const content = contentEl ? contentEl.innerHTML : null;
        ReactDOM.hydrate(React.createElement(AdditionalInformation, { content: content, title: title, image: image, variation: variation, defaultOpen: defaultOpen }), blockWrapper);
    });
};
exports.hydrate = hydrate;
//# sourceMappingURL=AdditionalInformation.js.map