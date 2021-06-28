"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFeedbackPage = exports.FeedbackPrompt = exports.FeedbackForm = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const mobx_react_1 = require("mobx-react");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCommentAlt_1 = require("@fortawesome/free-solid-svg-icons/faCommentAlt");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const mobx_1 = require("mobx");
const classnames_1 = __importDefault(require("classnames"));
const faPaperPlane_1 = require("@fortawesome/free-solid-svg-icons/faPaperPlane");
const sendFeedback = (feedback) => new Promise((resolve, reject) => {
    const json = mobx_1.toJS(feedback);
    const req = new XMLHttpRequest();
    json.environment = `Current URL: ${window.location.href}\nUser Agent: ${navigator.userAgent}\nViewport: ${window.innerWidth}x${window.innerHeight}`;
    req.addEventListener("readystatechange", () => {
        if (req.readyState === 4) {
            if (req.status !== 200)
                reject(`${req.status} ${req.statusText}`);
            else
                resolve(undefined);
        }
    });
    req.open("POST", `https://owid-feedback.netlify.app/.netlify/functions/hello`);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(json));
});
class Feedback {
    constructor() {
        this.name = "";
        this.email = "";
        this.message = "";
        this.environment = "";
    }
    clear() {
        this.name = "";
        this.email = "";
        this.message = "";
    }
}
__decorate([
    mobx_1.observable
], Feedback.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], Feedback.prototype, "email", void 0);
__decorate([
    mobx_1.observable
], Feedback.prototype, "message", void 0);
__decorate([
    mobx_1.action.bound
], Feedback.prototype, "clear", null);
let FeedbackForm = class FeedbackForm extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.feedback = new Feedback();
        this.loading = false;
        this.done = false;
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sendFeedback(this.feedback);
                this.feedback.clear();
                this.done = true;
            }
            catch (err) {
                this.error = err;
            }
            finally {
                this.loading = false;
            }
        });
    }
    onSubmit(e) {
        e.preventDefault();
        this.done = false;
        this.error = undefined;
        this.loading = true;
        this.submit();
    }
    onName(e) {
        this.feedback.name = e.currentTarget.value;
    }
    onEmail(e) {
        this.feedback.email = e.currentTarget.value;
    }
    onMessage(e) {
        this.feedback.message = e.currentTarget.value;
    }
    onClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
        // Clear the form after closing, in case the user has a 2nd message to send later.
        this.done = false;
    }
    renderBody() {
        var _a;
        const { loading, done } = this;
        const autofocus = (_a = this.props.autofocus) !== null && _a !== void 0 ? _a : true;
        if (done) {
            return (react_1.default.createElement("div", { className: "doneMessage" },
                react_1.default.createElement("div", { className: "icon" },
                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPaperPlane_1.faPaperPlane })),
                react_1.default.createElement("div", { className: "message" },
                    react_1.default.createElement("h3", null, "Thank you for your feedback"),
                    react_1.default.createElement("p", null, "We read all feedback, but due to a high volume of messages we are not able to reply to all.")),
                react_1.default.createElement("div", { className: "actions" },
                    react_1.default.createElement("button", { onClick: this.onClose }, "Close"))));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "header" }, "Leave us feedback"),
            react_1.default.createElement("div", { className: "notice" },
                react_1.default.createElement("p", null, "We read and consider all feedback, but due to a high volume of messages we are not able to reply to all.")),
            react_1.default.createElement("div", { className: "formBody" },
                react_1.default.createElement("div", { className: "formSection" },
                    react_1.default.createElement("label", { htmlFor: "feedback.name" }, "Your name"),
                    react_1.default.createElement("input", { id: "feedback.name", onChange: this.onName, autoFocus: autofocus, disabled: loading })),
                react_1.default.createElement("div", { className: "formSection" },
                    react_1.default.createElement("label", { htmlFor: "feedback.email" }, "Email address"),
                    react_1.default.createElement("input", { id: "feedback.email", onChange: this.onEmail, type: "email", required: true, disabled: loading })),
                react_1.default.createElement("div", { className: "formSection formSectionExpand" },
                    react_1.default.createElement("label", { htmlFor: "feedback.message" }, "Message"),
                    react_1.default.createElement("textarea", { id: "feedback.message", onChange: this.onMessage, rows: 5, minLength: 30, required: true, disabled: loading })),
                this.error ? (react_1.default.createElement("div", { style: { color: "red" } }, this.error)) : undefined,
                this.done ? (react_1.default.createElement("div", { style: { color: "green" } }, "Thanks for your feedback!")) : undefined),
            react_1.default.createElement("div", { className: "footer" },
                react_1.default.createElement("button", { type: "submit", disabled: loading }, "Send message"))));
    }
    render() {
        return (react_1.default.createElement("form", { className: classnames_1.default("FeedbackForm", {
                loading: this.loading,
            }), onSubmit: this.onSubmit }, this.renderBody()));
    }
};
__decorate([
    mobx_1.observable
], FeedbackForm.prototype, "loading", void 0);
__decorate([
    mobx_1.observable
], FeedbackForm.prototype, "done", void 0);
__decorate([
    mobx_1.observable
], FeedbackForm.prototype, "error", void 0);
__decorate([
    mobx_1.action.bound
], FeedbackForm.prototype, "onSubmit", null);
__decorate([
    mobx_1.action.bound
], FeedbackForm.prototype, "onName", null);
__decorate([
    mobx_1.action.bound
], FeedbackForm.prototype, "onEmail", null);
__decorate([
    mobx_1.action.bound
], FeedbackForm.prototype, "onMessage", null);
__decorate([
    mobx_1.action.bound
], FeedbackForm.prototype, "onClose", null);
FeedbackForm = __decorate([
    mobx_react_1.observer
], FeedbackForm);
exports.FeedbackForm = FeedbackForm;
let FeedbackPrompt = class FeedbackPrompt extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.isOpen = false;
    }
    toggleOpen() {
        this.isOpen = !this.isOpen;
    }
    onClose() {
        this.isOpen = false;
    }
    onClickOutside() {
        this.onClose();
    }
    render() {
        return (react_1.default.createElement("div", { className: `feedbackPromptContainer${this.isOpen ? " active" : ""}` },
            react_1.default.createElement("div", { style: { display: this.isOpen ? "block" : "none" } },
                react_1.default.createElement("div", { className: "overlay", onClick: this.onClickOutside }),
                react_1.default.createElement("div", { className: "box" },
                    react_1.default.createElement(FeedbackForm, { onClose: this.onClose }))),
            this.isOpen ? (react_1.default.createElement("button", { className: "prompt", onClick: this.toggleOpen },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes }),
                " Close")) : (react_1.default.createElement("button", { className: "prompt", "data-track-note": "page-open-feedback", onClick: this.toggleOpen },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCommentAlt_1.faCommentAlt }),
                " Feedback"))));
    }
};
__decorate([
    mobx_1.observable
], FeedbackPrompt.prototype, "isOpen", void 0);
__decorate([
    mobx_1.action.bound
], FeedbackPrompt.prototype, "toggleOpen", null);
__decorate([
    mobx_1.action.bound
], FeedbackPrompt.prototype, "onClose", null);
__decorate([
    mobx_1.action.bound
], FeedbackPrompt.prototype, "onClickOutside", null);
FeedbackPrompt = __decorate([
    mobx_react_1.observer
], FeedbackPrompt);
exports.FeedbackPrompt = FeedbackPrompt;
function runFeedbackPage() {
    react_dom_1.default.render(react_1.default.createElement("div", { className: "box" },
        react_1.default.createElement(FeedbackForm, null)), document.querySelector(".FeedbackPage main"));
}
exports.runFeedbackPage = runFeedbackPage;
//# sourceMappingURL=Feedback.js.map