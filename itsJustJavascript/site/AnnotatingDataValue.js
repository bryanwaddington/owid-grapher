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
exports.hydrateAnnotatingDataValue = exports.AnnotatingDataValue = void 0;
const faChartLine_1 = require("@fortawesome/free-solid-svg-icons/faChartLine");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const clientSettings_1 = require("../settings/clientSettings");
const DataValue_1 = require("./DataValue");
const SiteAnalytics_1 = require("./SiteAnalytics");
const AnnotatingDataValue_name = "AnnotatingDataValue";
const analytics = new SiteAnalytics_1.SiteAnalytics(clientSettings_1.ENV);
const AnnotatingDataValue = ({ dataValueProps, grapherInstance, }) => {
    const [isInteractive, setInteractive] = react_1.useState(false);
    const [label] = react_1.useState(DataValue_1.processTemplate(dataValueProps));
    const renderAnnotationInGrapher = () => {
        grapherInstance === null || grapherInstance === void 0 ? void 0 : grapherInstance.renderAnnotation({
            entityName: dataValueProps.entityName,
            year: Number(dataValueProps.year),
        });
        analytics.logDataValueAnnotate(label);
    };
    react_1.useEffect(() => {
        setInteractive(true);
    }, []);
    return (react_1.default.createElement("span", { className: "annotating-data-value" },
        react_1.default.createElement("script", { "data-type": AnnotatingDataValue_name, type: "component/props", dangerouslySetInnerHTML: {
                __html: JSON.stringify(dataValueProps),
            } }),
        react_1.default.createElement("span", { onMouseEnter: renderAnnotationInGrapher, onMouseLeave: grapherInstance === null || grapherInstance === void 0 ? void 0 : grapherInstance.resetAnnotation, className: isInteractive ? "interactive" : "" },
            react_1.default.createElement(DataValue_1.DataValue, { label: label }),
            isInteractive ? react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faChartLine_1.faChartLine }) : null)));
};
exports.AnnotatingDataValue = AnnotatingDataValue;
function hydrateAnnotatingDataValue(grapherInstance, figure) {
    var _a, _b;
    // todo: handle more layouts
    const annotatingDataValueConfigInPreviousColumn = (_b = (_a = figure === null || figure === void 0 ? void 0 : figure.closest(".wp-block-column")) === null || _a === void 0 ? void 0 : _a.previousElementSibling) === null || _b === void 0 ? void 0 : _b.querySelectorAll(`[data-type=${AnnotatingDataValue_name}]`);
    annotatingDataValueConfigInPreviousColumn === null || annotatingDataValueConfigInPreviousColumn === void 0 ? void 0 : annotatingDataValueConfigInPreviousColumn.forEach((config) => {
        const dataValueProps = JSON.parse(config.innerHTML);
        react_dom_1.default.hydrate(react_1.default.createElement(exports.AnnotatingDataValue, { dataValueProps: dataValueProps, grapherInstance: grapherInstance }), config.parentElement);
    });
}
exports.hydrateAnnotatingDataValue = hydrateAnnotatingDataValue;
//# sourceMappingURL=AnnotatingDataValue.js.map