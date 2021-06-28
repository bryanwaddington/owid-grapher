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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDonateForm = exports.DonateFormRunner = exports.DonateForm = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const classnames_1 = __importDefault(require("classnames"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const decko_1 = require("decko");
const react_recaptcha_1 = __importDefault(require("react-recaptcha"));
const clientSettings_1 = require("../../settings/clientSettings");
const stripe_1 = __importDefault(require("./stripe"));
var CurrencyCode;
(function (CurrencyCode) {
    CurrencyCode["USD"] = "USD";
    CurrencyCode["GBP"] = "GBP";
    CurrencyCode["EUR"] = "EUR";
})(CurrencyCode || (CurrencyCode = {}));
const currencySymbolByCode = {
    [CurrencyCode.USD]: "$",
    [CurrencyCode.GBP]: "£",
    [CurrencyCode.EUR]: "€",
};
const ONETIME_DONATION_AMOUNTS = [10, 50, 100, 500, 1000];
const MONTHLY_DONATION_AMOUNTS = [5, 10, 20, 50, 100];
const ONETIME_DEFAULT_INDEX = 1;
const MONTHLY_DEFAULT_INDEX = 1;
const MIN_DONATION = 1;
const MAX_DONATION = 100000;
const SUPPORTED_CURRENCY_CODES = [
    CurrencyCode.USD,
    CurrencyCode.GBP,
    CurrencyCode.EUR,
];
let DonateForm = class DonateForm extends React.Component {
    constructor() {
        super(...arguments);
        this.interval = "once";
        this.presetAmount = ONETIME_DONATION_AMOUNTS[ONETIME_DEFAULT_INDEX];
        this.customAmount = "";
        this.isCustom = false;
        this.name = "";
        this.showOnList = true;
        this.isSubmitting = false;
        this.isLoading = true;
        this.currencyCode = CurrencyCode.USD;
    }
    setInterval(interval) {
        this.interval = interval;
        this.presetAmount = this.intervalAmounts[interval === "monthly"
            ? MONTHLY_DEFAULT_INDEX
            : ONETIME_DEFAULT_INDEX];
    }
    setPresetAmount(amount) {
        this.presetAmount = amount;
        this.isCustom = false;
    }
    setCustomAmount(amount) {
        this.customAmount = amount;
        this.isCustom = true;
    }
    setIsCustom(isCustom) {
        this.isCustom = isCustom;
    }
    setName(name) {
        this.name = name;
    }
    setShowOnList(showOnList) {
        this.showOnList = showOnList;
    }
    setErrorMessage(message) {
        this.errorMessage = message;
    }
    setCurrency(currency) {
        this.currencyCode = currency;
    }
    get amount() {
        return this.isCustom
            ? parseFloat(this.customAmount || "")
            : this.presetAmount;
    }
    get intervalAmounts() {
        return this.interval === "monthly"
            ? MONTHLY_DONATION_AMOUNTS
            : ONETIME_DONATION_AMOUNTS;
    }
    get currencySymbol() {
        return currencySymbolByCode[this.currencyCode];
    }
    submitDonation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.amount ||
                this.amount > MAX_DONATION ||
                this.amount < MIN_DONATION) {
                throw new Error("You can only donate between $1 and $100,000 USD. For other amounts, please get in touch with us at donate@ourworldindata.org.");
            }
            const captchaToken = yield this.getCaptchaToken();
            const response = yield fetch(clientSettings_1.DONATE_API_URL, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: this.name,
                    showOnList: this.showOnList,
                    currency: this.currencyCode,
                    amount: Math.floor(this.amount * 100),
                    interval: this.interval,
                    successUrl: `${clientSettings_1.BAKED_BASE_URL}/donate/thank-you`,
                    cancelUrl: `${clientSettings_1.BAKED_BASE_URL}/donate`,
                    captchaToken: captchaToken,
                }),
            });
            const session = yield response.json();
            if (!response.ok)
                throw session;
            const result = yield stripe_1.default.redirectToCheckout({
                sessionId: session.id,
            });
            if (result.error) {
                // If `redirectToCheckout` fails due to a browser or network
                // error, display the localized error message to your customer.
                throw result.error;
            }
        });
    }
    getCaptchaToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!this.captchaInstance)
                    return reject(new Error("Could not load reCAPTCHA. Please try again. If the problem persists, please get in touch with us at donate@ourworldindata.org"));
                this.captchaPromiseHandlers = { resolve, reject };
                this.captchaInstance.reset();
                this.captchaInstance.execute();
            });
        });
    }
    onCaptchaLoad() {
        this.isLoading = false;
    }
    onCaptchaVerify(token) {
        if (this.captchaPromiseHandlers)
            this.captchaPromiseHandlers.resolve(token);
    }
    onSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            this.isSubmitting = true;
            this.errorMessage = undefined;
            try {
                yield this.submitDonation();
            }
            catch (error) {
                this.isSubmitting = false;
                mobx_1.runInAction(() => (this.errorMessage =
                    (error && error.message) ||
                        "Something went wrong. Please get in touch with us at donate@ourworldindata.org"));
            }
        });
    }
    render() {
        return (React.createElement("form", { className: "donate-form", onSubmit: this.onSubmit },
            React.createElement("fieldset", { className: "donate-form-interval" },
                React.createElement("legend", null,
                    React.createElement("h3", null, "Donation type")),
                React.createElement("div", { className: "owid-radios" },
                    React.createElement("div", { className: "owid-radio" },
                        React.createElement("input", { type: "radio", id: "once", value: "once", name: "interval", onChange: () => this.setInterval("once"), checked: this.interval === "once" }),
                        React.createElement("label", { htmlFor: "once" }, "One time")),
                    React.createElement("div", { className: "owid-radio" },
                        React.createElement("input", { type: "radio", id: "monthly", value: "monthly", name: "interval", onChange: () => this.setInterval("monthly"), checked: this.interval === "monthly" }),
                        React.createElement("label", { htmlFor: "monthly" }, "Monthly")))),
            React.createElement("fieldset", { className: "donate-form-currency" },
                React.createElement("legend", null,
                    React.createElement("h3", null, "Currency")),
                React.createElement("div", { className: "owid-radios" }, SUPPORTED_CURRENCY_CODES.map((code) => (React.createElement("div", { key: code, className: "owid-radio" },
                    React.createElement("input", { type: "radio", id: code, value: code, name: "currency", onChange: () => this.setCurrency(code), checked: this.currencyCode === code }),
                    React.createElement("label", { htmlFor: code }, code)))))),
            React.createElement("fieldset", { className: "donate-form-amount" },
                React.createElement("legend", null,
                    React.createElement("h3", null, "Amount")),
                React.createElement("div", { className: "radios" },
                    this.intervalAmounts.map((amount) => (React.createElement("div", { key: amount, className: "owid-radio" },
                        React.createElement("input", { type: "radio", id: `amount-${amount}`, value: amount, name: "amount", onChange: () => this.setPresetAmount(amount), checked: amount === this.presetAmount &&
                                !this.isCustom }),
                        React.createElement("label", { htmlFor: `amount-${amount}` },
                            this.currencySymbol,
                            amount)))),
                    React.createElement("div", { className: "owid-radio custom-radio" },
                        React.createElement("input", { type: "radio", id: "custom", name: "amount", checked: this.isCustom, onChange: (event) => this.setIsCustom(event.target.checked) }),
                        React.createElement("label", { htmlFor: "custom" },
                            this.currencySymbol,
                            React.createElement("input", { type: "text", placeholder: "Other", name: "custom-amount", className: "custom-amount-input", onChange: (event) => this.setCustomAmount(event.target.value), value: this.customAmount }))))),
            React.createElement("fieldset", null,
                React.createElement("div", { className: "owid-block-field" },
                    React.createElement("label", { htmlFor: "name" },
                        React.createElement("h3", null, "Your name (optional)")),
                    React.createElement("input", { id: "name", type: "text", className: "owid-input", value: this.name, onChange: (event) => this.setName(event.target.value) }))),
            React.createElement("fieldset", null,
                React.createElement("div", { className: "owid-checkboxes" },
                    React.createElement("div", { className: "owid-checkbox-inline" },
                        React.createElement("input", { type: "checkbox", id: "showOnList", value: "showOnList", name: "type", checked: this.showOnList, onChange: (event) => this.setShowOnList(event.target.checked) }),
                        React.createElement("label", { htmlFor: "showOnList" },
                            "Include me on the public",
                            " ",
                            React.createElement("a", { href: "/funding", target: "_blank" }, "list of donors"))))),
            this.errorMessage && (React.createElement("p", { className: "error" }, this.errorMessage)),
            React.createElement(react_recaptcha_1.default, { ref: (inst) => (this.captchaInstance = inst), sitekey: clientSettings_1.RECAPTCHA_SITE_KEY, size: "invisible", badge: "bottomleft", render: "explicit", onloadCallback: this.onCaptchaLoad, verifyCallback: this.onCaptchaVerify }),
            React.createElement("button", { type: "submit", className: classnames_1.default("owid-button", {
                    disabled: this.isSubmitting,
                }), disabled: this.isLoading },
                "Donate",
                " ",
                this.amount ? `${this.currencySymbol}${this.amount}` : "",
                " ",
                this.interval === "monthly" ? "per month" : ""),
            React.createElement("p", { className: "note" }, "You will be redirected to a secure page to enter your payment details. We will not share any details you enter with any third parties."),
            React.createElement("p", { className: "note" },
                "This site is protected by reCAPTCHA and the Google",
                " ",
                React.createElement("a", { href: "https://policies.google.com/privacy" }, "Privacy Policy"),
                " ",
                "and",
                " ",
                React.createElement("a", { href: "https://policies.google.com/terms" }, "Terms of Service"),
                " ",
                "apply.")));
    }
};
__decorate([
    mobx_1.observable
], DonateForm.prototype, "interval", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "presetAmount", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "customAmount", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "isCustom", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "showOnList", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "errorMessage", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "isSubmitting", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "isLoading", void 0);
__decorate([
    mobx_1.observable
], DonateForm.prototype, "currencyCode", void 0);
__decorate([
    mobx_1.observable.ref
], DonateForm.prototype, "captchaPromiseHandlers", void 0);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setInterval", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setPresetAmount", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setCustomAmount", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setIsCustom", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setName", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setShowOnList", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setErrorMessage", null);
__decorate([
    mobx_1.action.bound
], DonateForm.prototype, "setCurrency", null);
__decorate([
    mobx_1.computed
], DonateForm.prototype, "amount", null);
__decorate([
    mobx_1.computed
], DonateForm.prototype, "intervalAmounts", null);
__decorate([
    mobx_1.computed
], DonateForm.prototype, "currencySymbol", null);
__decorate([
    decko_1.bind
], DonateForm.prototype, "getCaptchaToken", null);
__decorate([
    decko_1.bind
], DonateForm.prototype, "onCaptchaLoad", null);
__decorate([
    decko_1.bind
], DonateForm.prototype, "onCaptchaVerify", null);
__decorate([
    decko_1.bind
], DonateForm.prototype, "onSubmit", null);
DonateForm = __decorate([
    mobx_react_1.observer
], DonateForm);
exports.DonateForm = DonateForm;
class DonateFormRunner {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            ReactDOM.render(React.createElement(DonateForm, null), document.querySelector(".donate-form-container"));
        });
    }
}
exports.DonateFormRunner = DonateFormRunner;
function runDonateForm() {
    const donateForm = new DonateFormRunner();
    donateForm.run();
}
exports.runDonateForm = runDonateForm;
//# sourceMappingURL=DonateForm.js.map