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
var EmbedMenu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareMenu = void 0;
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const mobx_1 = require("mobx");
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faTwitter_1 = require("@fortawesome/free-brands-svg-icons/faTwitter");
const faFacebook_1 = require("@fortawesome/free-brands-svg-icons/faFacebook");
const faCode_1 = require("@fortawesome/free-solid-svg-icons/faCode");
const faShareAlt_1 = require("@fortawesome/free-solid-svg-icons/faShareAlt");
const faCopy_1 = require("@fortawesome/free-solid-svg-icons/faCopy");
const faEdit_1 = require("@fortawesome/free-solid-svg-icons/faEdit");
let ShareMenu = class ShareMenu extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.dismissable = true;
        this.state = {
            copied: false,
        };
    }
    get manager() {
        return this.props.manager;
    }
    get title() {
        var _a;
        return (_a = this.manager.currentTitle) !== null && _a !== void 0 ? _a : "";
    }
    get isDisabled() {
        return !this.manager.slug;
    }
    get canonicalUrl() {
        return this.manager.canonicalUrl;
    }
    dismiss() {
        this.props.onDismiss();
    }
    onClickSomewhere() {
        if (this.dismissable)
            this.dismiss();
        else
            this.dismissable = true;
    }
    componentDidMount() {
        document.addEventListener("click", this.onClickSomewhere);
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.onClickSomewhere);
    }
    onEmbed() {
        if (!this.canonicalUrl)
            return;
        this.manager.addPopup(react_1.default.createElement(EmbedMenu, { key: "EmbedMenu", manager: this.manager }));
        this.dismiss();
    }
    onNavigatorShare() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canonicalUrl || !navigator.share)
                return;
            const shareData = {
                title: this.title,
                url: this.canonicalUrl,
            };
            try {
                yield navigator.share(shareData);
            }
            catch (err) {
                console.error("couldn't share using navigator.share", err);
            }
        });
    }
    onCopy() {
        if (!this.canonicalUrl)
            return;
        if (copy_to_clipboard_1.default(this.canonicalUrl))
            this.setState({ copied: true });
    }
    get twitterHref() {
        let href = "https://twitter.com/intent/tweet/?text=" +
            encodeURIComponent(this.title);
        if (this.canonicalUrl)
            href += "&url=" + encodeURIComponent(this.canonicalUrl);
        return href;
    }
    get facebookHref() {
        let href = "https://www.facebook.com/dialog/share?app_id=1149943818390250&display=page";
        if (this.canonicalUrl)
            href += "&href=" + encodeURIComponent(this.canonicalUrl);
        return href;
    }
    render() {
        const { twitterHref, facebookHref, isDisabled, manager } = this;
        const { editUrl } = manager;
        return (react_1.default.createElement("div", { className: "ShareMenu" + (isDisabled ? " disabled" : ""), onClick: mobx_1.action(() => (this.dismissable = false)) },
            react_1.default.createElement("h2", null, "Share"),
            react_1.default.createElement("a", { className: "btn", target: "_blank", title: "Tweet a link", "data-track-note": "chart-share-twitter", href: twitterHref, rel: "noopener" },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTwitter_1.faTwitter }),
                " Twitter"),
            react_1.default.createElement("a", { className: "btn", target: "_blank", title: "Share on Facebook", "data-track-note": "chart-share-facebook", href: facebookHref, rel: "noopener" },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faFacebook_1.faFacebook }),
                " Facebook"),
            react_1.default.createElement("a", { className: "btn", title: "Embed this visualization in another HTML document", "data-track-note": "chart-share-embed", onClick: this.onEmbed },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCode_1.faCode }),
                " Embed"),
            "share" in navigator && (react_1.default.createElement("a", { className: "btn", title: "Share this visualization with an app on your device", "data-track-note": "chart-share-navigator", onClick: this.onNavigatorShare },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faShareAlt_1.faShareAlt }),
                " Share via\u2026")),
            react_1.default.createElement("a", { className: "btn", title: "Copy link to clipboard", "data-track-note": "chart-share-copylink", onClick: this.onCopy },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCopy_1.faCopy }),
                this.state.copied ? "Copied!" : "Copy link"),
            editUrl && (react_1.default.createElement("a", { className: "btn", target: "_blank", title: "Edit chart", href: editUrl, rel: "noopener" },
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faEdit_1.faEdit }),
                " Edit"))));
    }
};
__decorate([
    mobx_1.computed
], ShareMenu.prototype, "manager", null);
__decorate([
    mobx_1.computed
], ShareMenu.prototype, "title", null);
__decorate([
    mobx_1.computed
], ShareMenu.prototype, "isDisabled", null);
__decorate([
    mobx_1.computed
], ShareMenu.prototype, "canonicalUrl", null);
__decorate([
    mobx_1.action.bound
], ShareMenu.prototype, "dismiss", null);
__decorate([
    mobx_1.action.bound
], ShareMenu.prototype, "onClickSomewhere", null);
__decorate([
    mobx_1.action.bound
], ShareMenu.prototype, "onEmbed", null);
__decorate([
    mobx_1.action.bound
], ShareMenu.prototype, "onNavigatorShare", null);
__decorate([
    mobx_1.action.bound
], ShareMenu.prototype, "onCopy", null);
__decorate([
    mobx_1.computed
], ShareMenu.prototype, "twitterHref", null);
__decorate([
    mobx_1.computed
], ShareMenu.prototype, "facebookHref", null);
ShareMenu = __decorate([
    mobx_react_1.observer
], ShareMenu);
exports.ShareMenu = ShareMenu;
let EmbedMenu = EmbedMenu_1 = class EmbedMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.dismissable = true;
    }
    onClickSomewhere() {
        if (this.dismissable)
            this.manager.removePopup(EmbedMenu_1);
        else
            this.dismissable = true;
    }
    get manager() {
        return this.props.manager;
    }
    onClick() {
        this.dismissable = false;
    }
    componentDidMount() {
        document.addEventListener("click", this.onClickSomewhere);
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.onClickSomewhere);
    }
    render() {
        var _a;
        const url = (_a = this.manager.embedUrl) !== null && _a !== void 0 ? _a : this.manager.canonicalUrl;
        return (react_1.default.createElement("div", { className: "embedMenu", onClick: this.onClick },
            react_1.default.createElement("h2", null, "Embed"),
            react_1.default.createElement("p", null, "Paste this into any HTML page:"),
            react_1.default.createElement("textarea", { readOnly: true, onFocus: (evt) => evt.currentTarget.select(), value: `<iframe src="${url}" loading="lazy" style="width: 100%; height: 600px; border: 0px none;"></iframe>` }),
            this.manager.embedDialogAdditionalElements));
    }
};
__decorate([
    mobx_1.action.bound
], EmbedMenu.prototype, "onClickSomewhere", null);
__decorate([
    mobx_1.computed
], EmbedMenu.prototype, "manager", null);
__decorate([
    mobx_1.action.bound
], EmbedMenu.prototype, "onClick", null);
EmbedMenu = EmbedMenu_1 = __decorate([
    mobx_react_1.observer
], EmbedMenu);
//# sourceMappingURL=ShareMenu.js.map