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
exports.runLightbox = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const react_1 = require("react");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const faSearchPlus_1 = require("@fortawesome/free-solid-svg-icons/faSearchPlus");
const faSearchMinus_1 = require("@fortawesome/free-solid-svg-icons/faSearchMinus");
const faCompress_1 = require("@fortawesome/free-solid-svg-icons/faCompress");
const faDownload_1 = require("@fortawesome/free-solid-svg-icons/faDownload");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_zoom_pan_pinch_1 = require("react-zoom-pan-pinch");
const LoadingIndicator_1 = require("../grapher/loadingIndicator/LoadingIndicator");
const Lightbox = ({ children, containerNode, imgSrc, }) => {
    const close = () => {
        if (containerNode) {
            ReactDOM.unmountComponentAtNode(containerNode);
        }
    };
    const [isLoaded, setIsLoaded] = react_1.useState(false);
    const contentRef = react_1.useRef(null);
    react_1.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                close();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return (React.createElement("div", { className: "container" },
        !isLoaded && (React.createElement(LoadingIndicator_1.LoadingIndicator, { backgroundColor: "#000", color: "#ccc" })),
        React.createElement(react_zoom_pan_pinch_1.TransformWrapper, { doubleClick: { mode: "reset" } }, ({ zoomIn, zoomOut, resetTransform }) => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "content", ref: contentRef, onClick: (e) => {
                    if (e.target === contentRef.current) {
                        close();
                    }
                } },
                React.createElement(react_zoom_pan_pinch_1.TransformComponent, null, children(isLoaded, setIsLoaded))),
            React.createElement("div", { className: "tools" },
                isLoaded && (React.createElement(React.Fragment, null,
                    React.createElement("button", { "aria-label": "Zoom in", onClick: zoomIn },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearchPlus_1.faSearchPlus })),
                    React.createElement("button", { "aria-label": "Zoom out", onClick: zoomOut },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearchMinus_1.faSearchMinus })),
                    React.createElement("button", { "aria-label": "Reset zoom", onClick: resetTransform },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCompress_1.faCompress })),
                    React.createElement("a", { href: imgSrc, download: imgSrc.split("/").pop(), "aria-label": "Download high resolution image" },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload })))),
                React.createElement("button", { "aria-label": "Close", onClick: close, className: "close" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus }))))))));
};
const Image = ({ src, isLoaded, setIsLoaded, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement("img", { onLoad: () => {
                setIsLoaded(true);
            }, src: src, style: { opacity: !isLoaded ? 0 : 1, transition: "opacity 1s" } })));
};
const runLightbox = () => {
    let lightboxContainer = document.querySelector(".lightbox");
    if (!lightboxContainer) {
        lightboxContainer = document.createElement("div");
        lightboxContainer.classList.add("lightbox");
        document.body.appendChild(lightboxContainer);
    }
    Array.from(document.querySelectorAll(".article-content img")).forEach((img) => {
        if (img.closest("[data-no-lightbox]"))
            return;
        img.classList.add("lightbox-enabled");
        img.addEventListener("click", () => {
            var _a;
            const imgSrc = (_a = img.getAttribute("data-high-res-src")) !== null && _a !== void 0 ? _a : img.src;
            if (imgSrc) {
                ReactDOM.render(React.createElement(Lightbox, { imgSrc: imgSrc, containerNode: lightboxContainer }, (isLoaded, setIsLoaded) => (React.createElement(Image, { src: imgSrc, isLoaded: isLoaded, setIsLoaded: setIsLoaded }))), lightboxContainer);
            }
        });
    });
};
exports.runLightbox = runLightbox;
//# sourceMappingURL=Lightbox.js.map