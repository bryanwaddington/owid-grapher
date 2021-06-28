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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorTextTab = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Forms_1 = require("./Forms");
const slugify_1 = __importDefault(require("slugify"));
const Grapher_1 = require("../grapher/core/Grapher"); // fix.
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const faMinus_1 = require("@fortawesome/free-solid-svg-icons/faMinus");
let EditorTextTab = class EditorTextTab extends React.Component {
    onSlug(slug) {
        this.props.editor.grapher.slug = slugify_1.default(slug).toLowerCase();
    }
    onChangeLogo(value) {
        if (value === "none") {
            this.props.editor.grapher.hideLogo = true;
        }
        else {
            this.props.editor.grapher.hideLogo = undefined;
            this.props.editor.grapher.logo = value || undefined;
        }
    }
    onAddRelatedQuestion() {
        const { grapher } = this.props.editor;
        grapher.relatedQuestions.push({
            text: "",
            url: "",
        });
    }
    onRemoveRelatedQuestion(idx) {
        const { grapher } = this.props.editor;
        grapher.relatedQuestions.splice(idx, 1);
    }
    render() {
        const { grapher, references } = this.props.editor;
        const { relatedQuestions } = grapher;
        return (React.createElement("div", null,
            React.createElement(Forms_1.Section, { name: "Header" },
                React.createElement(Forms_1.BindAutoString, { field: "title", store: grapher, auto: grapher.displayTitle, softCharacterLimit: 100 }),
                React.createElement(Forms_1.Toggle, { label: "Hide automatic time/entity", value: !!grapher.hideTitleAnnotation, onValue: mobx_1.action((value) => (grapher.hideTitleAnnotation =
                        value || undefined)) }),
                React.createElement(Forms_1.AutoTextField, { label: "/grapher", value: grapher.displaySlug, onValue: this.onSlug, isAuto: grapher.slug === undefined, onToggleAuto: () => (grapher.slug =
                        grapher.slug === undefined
                            ? grapher.displaySlug
                            : undefined), helpText: "Human-friendly URL for this chart" }),
                React.createElement(Forms_1.BindString, { field: "subtitle", store: grapher, placeholder: "Briefly describe the context of the data. It's best to avoid duplicating any information which can be easily inferred from other visual elements of the chart.", textarea: true, softCharacterLimit: 280 }),
                React.createElement("h6", null, "Logo"),
                React.createElement(Forms_1.RadioGroup, { options: [
                        { label: "OWID", value: "owid" },
                        { label: "CORE+OWID", value: "core+owid" },
                        { label: "GV+OWID", value: "gv+owid" },
                        { label: "No logo", value: "none" },
                    ], value: grapher.hideLogo ? "none" : grapher.logo || "owid", onChange: this.onChangeLogo })),
            React.createElement(Forms_1.Section, { name: "Footer" },
                React.createElement(Forms_1.BindAutoString, { label: "Source", field: "sourceDesc", store: grapher, auto: grapher.sourcesLine, helpText: "Short comma-separated list of source names", softCharacterLimit: 60 }),
                React.createElement(Forms_1.BindString, { label: "Origin url", field: "originUrl", store: grapher, placeholder: grapher.originUrlWithProtocol, helpText: "The page containing this chart where more context can be found" }),
                references && references.length > 0 && (React.createElement("div", { className: "originSuggestions" },
                    React.createElement("p", null, "Origin url suggestions"),
                    React.createElement("ul", null, references.map((post) => (React.createElement("li", { key: post.id }, post.url)))))),
                React.createElement(Forms_1.BindString, { label: "Footer note", field: "note", store: grapher, helpText: "Any important clarification needed to avoid miscommunication", softCharacterLimit: 140 })),
            React.createElement(Forms_1.Section, { name: "Related" },
                relatedQuestions.map((question, idx) => (React.createElement("div", { key: idx },
                    React.createElement(Forms_1.TextField, { label: "Related question", value: question.text, onValue: mobx_1.action((value) => {
                            question.text = value;
                        }), placeholder: "e.g. How did countries respond to the pandemic?", helpText: "Short question promoting exploration of related content", softCharacterLimit: 50 }),
                    question.text && (React.createElement(Forms_1.TextField, { label: "URL", value: question.url, onValue: mobx_1.action((value) => {
                            question.url = value;
                        }), placeholder: "e.g. https://ourworldindata.org/coronavirus", helpText: "Page or section of a page where the answer to the previous question can be found.", errorMessage: Grapher_1.getErrorMessageRelatedQuestionUrl(question) })),
                    React.createElement(Forms_1.Button, { onClick: () => this.onRemoveRelatedQuestion(idx) },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faMinus_1.faMinus }),
                        " Remove related question")))),
                !relatedQuestions.length && (React.createElement(Forms_1.Button, { onClick: this.onAddRelatedQuestion },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus }),
                    " Add related question"))),
            React.createElement(Forms_1.Section, { name: "Misc" },
                React.createElement(Forms_1.BindString, { label: "Internal author notes", field: "internalNotes", store: grapher, placeholder: "e.g. WIP, needs review, etc", textarea: true }),
                React.createElement(Forms_1.BindString, { label: "Variant name", field: "variantName", store: grapher, placeholder: "e.g. IHME data", helpText: "Optional variant name for distinguishing charts with the same title" }))));
    }
};
__decorate([
    mobx_1.action.bound
], EditorTextTab.prototype, "onSlug", null);
__decorate([
    mobx_1.action.bound
], EditorTextTab.prototype, "onChangeLogo", null);
__decorate([
    mobx_1.action.bound
], EditorTextTab.prototype, "onAddRelatedQuestion", null);
__decorate([
    mobx_1.action.bound
], EditorTextTab.prototype, "onRemoveRelatedQuestion", null);
EditorTextTab = __decorate([
    mobx_react_1.observer
], EditorTextTab);
exports.EditorTextTab = EditorTextTab;
//# sourceMappingURL=EditorTextTab.js.map