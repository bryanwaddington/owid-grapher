"use strict";
/* Forms.tsx
 * ================
 *
 * Reusable React components to keep admin UI succint and consistent
 */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.EditableTags = exports.Timeago = exports.LoadingBlocker = exports.Modal = exports.BindAutoFloat = exports.BindFloat = exports.BindAutoString = exports.BindString = exports.AutoTextField = exports.Section = exports.ColorBox = exports.EditableListItem = exports.EditableList = exports.Toggle = exports.NumericSelectField = exports.RadioGroup = exports.SelectGroupsField = exports.SelectField = exports.NumberField = exports.SearchField = exports.TextField = exports.FieldsRow = void 0;
const React = __importStar(require("react"));
const lodash = __importStar(require("lodash"));
const decko_1 = require("decko");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../clientUtils/Util");
const Colorpicker_1 = require("./Colorpicker");
const faCog_1 = require("@fortawesome/free-solid-svg-icons/faCog");
const faLink_1 = require("@fortawesome/free-solid-svg-icons/faLink");
const faPaintBrush_1 = require("@fortawesome/free-solid-svg-icons/faPaintBrush");
const faUnlink_1 = require("@fortawesome/free-solid-svg-icons/faUnlink");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
class FieldsRow extends React.Component {
    render() {
        const { props } = this;
        return React.createElement("div", { className: "FieldsRow" }, props.children);
    }
}
exports.FieldsRow = FieldsRow;
class TextField extends React.Component {
    constructor(props) {
        super(props);
        this.base = React.createRef();
    }
    onKeyDown(ev) {
        if (ev.key === "Enter" && this.props.onEnter) {
            this.props.onEnter();
            ev.preventDefault();
        }
        else if (ev.key === "Escape" && this.props.onEscape) {
            this.props.onEscape();
            ev.preventDefault();
        }
    }
    componentDidMount() {
        if (this.props.autofocus) {
            const input = this.base.current.querySelector("input");
            input.focus();
        }
    }
    render() {
        const { props } = this;
        const passthroughProps = Util_1.pick(props, [
            "placeholder",
            "title",
            "disabled",
            "required",
            "onBlur",
        ]);
        return (React.createElement("div", { className: "form-group", ref: this.base },
            props.label && React.createElement("label", null, props.label),
            React.createElement("input", Object.assign({ className: "form-control", type: "text", value: props.value || "", onChange: (e) => this.props.onValue(e.currentTarget.value), onKeyDown: this.onKeyDown }, passthroughProps)),
            props.helpText && (React.createElement("small", { className: "form-text text-muted" }, props.helpText)),
            props.softCharacterLimit && props.value && (React.createElement(SoftCharacterLimit, { text: props.value, limit: props.softCharacterLimit })),
            props.errorMessage && (React.createElement(ErrorMessage, { message: props.errorMessage }))));
    }
}
__decorate([
    decko_1.bind
], TextField.prototype, "onKeyDown", null);
exports.TextField = TextField;
class TextAreaField extends React.Component {
    onChange(ev) {
        const value = ev.currentTarget.value;
        this.props.onValue(value);
    }
    render() {
        const { props } = this;
        const passthroughProps = Util_1.pick(props, [
            "placeholder",
            "title",
            "disabled",
            "label",
            "rows",
        ]);
        return (React.createElement("div", { className: "form-group" },
            props.label && React.createElement("label", null, props.label),
            React.createElement("textarea", Object.assign({ className: "form-control", value: props.value, onChange: this.onChange, rows: 5 }, passthroughProps)),
            props.helpText && (React.createElement("small", { className: "form-text text-muted" }, props.helpText)),
            props.softCharacterLimit && props.value && (React.createElement(SoftCharacterLimit, { text: props.value, limit: props.softCharacterLimit }))));
    }
}
__decorate([
    decko_1.bind
], TextAreaField.prototype, "onChange", null);
class SearchField extends TextField {
}
exports.SearchField = SearchField;
class NumberField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: undefined,
        };
    }
    render() {
        var _a, _b;
        const { props, state } = this;
        const textFieldProps = Object.assign(Object.assign({}, props), { value: (_a = state.inputValue) !== null && _a !== void 0 ? _a : (_b = props.value) === null || _b === void 0 ? void 0 : _b.toString(), onValue: (value) => {
                const allowInputRegex = new RegExp((props.allowNegative ? "^-?" : "^") +
                    (props.allowDecimal ? "\\d*\\.?\\d*$" : "\\d*$"));
                if (!allowInputRegex.test(value))
                    return;
                const asNumber = parseFloat(value);
                const isNumber = !isNaN(asNumber);
                const inputMatches = value === asNumber.toString();
                this.setState({ inputValue: inputMatches ? undefined : value });
                props.onValue(isNumber ? asNumber : undefined);
            }, onBlur: () => this.setState({
                inputValue: undefined,
            }) });
        return React.createElement(TextField, Object.assign({}, textFieldProps));
    }
}
exports.NumberField = NumberField;
class SelectField extends React.Component {
    render() {
        const { props } = this;
        const options = props.options.map((opt, i) => {
            return {
                key: opt,
                value: opt,
                text: (props.optionLabels && props.optionLabels[i]) || opt,
            };
        });
        return (React.createElement("div", { className: "form-group" },
            props.label && React.createElement("label", null, props.label),
            React.createElement("select", { className: "form-control", onChange: (e) => props.onValue(e.currentTarget.value), value: props.value, defaultValue: undefined },
                props.placeholder ? (React.createElement("option", { key: undefined, value: undefined, hidden: true }, props.placeholder)) : null,
                options.map((opt) => (React.createElement("option", { key: opt.value, value: opt.value }, opt.text)))),
            props.helpText && (React.createElement("small", { className: "form-text text-muted" }, props.helpText))));
    }
}
exports.SelectField = SelectField;
class SelectGroupsField extends React.Component {
    render() {
        const { props } = this;
        return (React.createElement("div", { className: "form-group" },
            props.label && React.createElement("label", null, props.label),
            React.createElement("select", { className: "form-control", onChange: (e) => props.onValue(e.currentTarget.value), value: props.value },
                props.options.map((opt) => (React.createElement("option", { key: opt.value, value: opt.value }, opt.label))),
                props.groups.map((group) => (React.createElement("optgroup", { key: group.title, label: group.title }, group.options.map((opt) => (React.createElement("option", { key: opt.value, value: opt.value }, opt.label || opt.value))))))),
            props.helpText && (React.createElement("small", { className: "form-text text-muted" }, props.helpText))));
    }
}
exports.SelectGroupsField = SelectGroupsField;
class RadioGroup extends React.Component {
    render() {
        return (React.createElement("div", { className: "RadioGroup" }, this.props.options.map((option) => {
            return (React.createElement("div", { key: option.value, className: "radioOption" },
                React.createElement("input", { type: "radio", id: option.value, checked: option.value === this.props.value, onChange: () => this.props.onChange(option.value) }),
                React.createElement("label", { htmlFor: option.value }, option.label || option.value)));
        })));
    }
}
exports.RadioGroup = RadioGroup;
class NumericSelectField extends React.Component {
    render() {
        const props = Object.assign(Object.assign({}, this.props), { value: this.props.value !== undefined
                ? this.props.value.toString()
                : "", options: this.props.options.map((opt) => opt.toString()), onValue: (value) => {
                const asNumber = parseFloat(value);
                this.props.onValue(asNumber);
            } });
        return React.createElement(SelectField, Object.assign({}, props));
    }
}
exports.NumericSelectField = NumericSelectField;
class Toggle extends React.Component {
    onChange(e) {
        this.props.onValue(!!e.currentTarget.checked);
    }
    render() {
        const { props } = this;
        const passthroughProps = Util_1.pick(props, ["title", "disabled"]);
        return (React.createElement("div", { className: "form-check" },
            React.createElement("label", { className: "form-check-label" },
                React.createElement("input", Object.assign({ className: "form-check-input", type: "checkbox", checked: props.value, onChange: this.onChange }, passthroughProps)),
                props.label)));
    }
}
__decorate([
    mobx_1.action.bound
], Toggle.prototype, "onChange", null);
exports.Toggle = Toggle;
class EditableList extends React.Component {
    render() {
        return this.props.children ? (React.createElement("ul", Object.assign({}, this.props, { className: "list-group" +
                (this.props.className ? ` ${this.props.className}` : "") }))) : null;
    }
}
exports.EditableList = EditableList;
class EditableListItem extends React.Component {
    render() {
        return (React.createElement("li", Object.assign({}, this.props, { className: "list-group-item" +
                (this.props.className ? ` ${this.props.className}` : "") })));
    }
}
exports.EditableListItem = EditableListItem;
let ColorBox = class ColorBox extends React.Component {
    render() {
        const { color } = this.props;
        const style = color !== undefined ? { backgroundColor: color } : undefined;
        return (React.createElement(Tippy_1.Tippy, { content: React.createElement(React.Fragment, null,
                React.createElement(Colorpicker_1.Colorpicker, { color: color, onColor: this.props.onColor }),
                React.createElement("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    } },
                    React.createElement(Button, { onClick: () => this.props.onColor(undefined) }, "Reset to color scheme default"))), placement: "right", interactive: true, trigger: "click", appendTo: () => document.body, className: "colorpicker-tooltip" },
            React.createElement("div", { className: "ColorBox", style: style }, color === undefined && (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPaintBrush_1.faPaintBrush })))));
    }
};
ColorBox = __decorate([
    mobx_react_1.observer
], ColorBox);
exports.ColorBox = ColorBox;
class Section extends React.Component {
    render() {
        return (React.createElement("section", null,
            React.createElement("h5", null, this.props.name),
            this.props.children));
    }
}
exports.Section = Section;
const ErrorMessage = ({ message }) => (React.createElement("div", { style: { color: "red" } }, message));
let SoftCharacterLimit = class SoftCharacterLimit extends React.Component {
    render() {
        const { text, limit } = this.props;
        return (React.createElement("div", { style: text.length > limit
                ? { color: "#D17D05" }
                : { color: "rgba(0,0,0,0.3)" } },
            text.length,
            " / ",
            limit,
            text.length > limit && (React.createElement("p", null,
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExclamationTriangle_1.faExclamationTriangle }),
                " This text is long and may cause rendering issues in smaller viewports."))));
    }
};
SoftCharacterLimit = __decorate([
    mobx_react_1.observer
], SoftCharacterLimit);
let AutoTextField = class AutoTextField extends React.Component {
    render() {
        const { props } = this;
        return (React.createElement("div", { className: "form-group AutoTextField" },
            props.label && React.createElement("label", null, props.label),
            React.createElement("div", { className: "input-group mb-2 mb-sm-0" },
                React.createElement("input", { type: "text", className: "form-control", value: props.value, placeholder: props.placeholder, onChange: (e) => props.onValue(e.currentTarget.value), onBlur: props.onBlur }),
                React.createElement("div", { className: "input-group-addon", onClick: () => props.onToggleAuto(!props.isAuto), title: props.isAuto ? "Automatic default" : "Manual input" }, props.isAuto ? (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faLink_1.faLink })) : (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faUnlink_1.faUnlink })))),
            props.helpText && (React.createElement("small", { className: "form-text text-muted" }, props.helpText)),
            props.softCharacterLimit && props.value && (React.createElement(SoftCharacterLimit, { text: props.value, limit: props.softCharacterLimit }))));
    }
};
AutoTextField = __decorate([
    mobx_react_1.observer
], AutoTextField);
exports.AutoTextField = AutoTextField;
let BindString = class BindString extends React.Component {
    onValue(value) {
        this.props.store[this.props.field] = (value || undefined);
    }
    render() {
        const { props } = this;
        const { field, store, label, textarea } = props, rest = __rest(props, ["field", "store", "label", "textarea"]);
        const value = store[field];
        if (textarea)
            return (React.createElement(TextAreaField, Object.assign({ label: label === undefined ? Util_1.capitalize(field) : label, value: value || "", onValue: this.onValue }, rest)));
        else
            return (React.createElement(TextField, Object.assign({ label: label === undefined ? Util_1.capitalize(field) : label, value: value || "", onValue: this.onValue }, rest)));
    }
};
__decorate([
    mobx_1.action.bound
], BindString.prototype, "onValue", null);
BindString = __decorate([
    mobx_react_1.observer
], BindString);
exports.BindString = BindString;
let BindAutoString = class BindAutoString extends React.Component {
    onValue(value) {
        this.props.store[this.props.field] = value;
    }
    onToggleAuto(value) {
        this.props.store[this.props.field] = (value
            ? undefined
            : this.props.auto);
    }
    render() {
        const _a = this.props, { field, store, label, auto } = _a, rest = __rest(_a, ["field", "store", "label", "auto"]);
        const value = store[field];
        return (React.createElement(AutoTextField, Object.assign({ label: label || Util_1.capitalize(field), value: value === undefined ? auto : value, isAuto: value === undefined, onValue: this.onValue, onToggleAuto: this.onToggleAuto }, rest)));
    }
};
__decorate([
    mobx_1.action.bound
], BindAutoString.prototype, "onValue", null);
__decorate([
    mobx_1.action.bound
], BindAutoString.prototype, "onToggleAuto", null);
BindAutoString = __decorate([
    mobx_react_1.observer
], BindAutoString);
exports.BindAutoString = BindAutoString;
class AutoFloatField extends React.Component {
    render() {
        const { props } = this;
        const textFieldProps = Object.assign(Object.assign({}, props), { value: props.isAuto ? undefined : props.value.toString(), onValue: (value) => {
                const asNumber = parseFloat(value);
                props.onValue(isNaN(asNumber) ? undefined : asNumber);
            }, placeholder: props.isAuto ? props.value.toString() : undefined });
        return React.createElement(AutoTextField, Object.assign({}, textFieldProps));
    }
}
class FloatField extends React.Component {
    render() {
        const { props } = this;
        const textFieldProps = Object.assign(Object.assign({}, props), { value: props.value === undefined ? undefined : props.value.toString(), onValue: (value) => {
                const asNumber = parseFloat(value);
                props.onValue(isNaN(asNumber) ? undefined : asNumber);
            } });
        return React.createElement(TextField, Object.assign({}, textFieldProps));
    }
}
let BindFloat = class BindFloat extends React.Component {
    onValue(value) {
        this.props.store[this.props.field] = value;
    }
    render() {
        const _a = this.props, { field, store, label } = _a, rest = __rest(_a, ["field", "store", "label"]);
        const value = store[field];
        return (React.createElement(FloatField, Object.assign({ label: label || Util_1.capitalize(field), value: value, onValue: this.onValue }, rest)));
    }
};
__decorate([
    mobx_1.action.bound
], BindFloat.prototype, "onValue", null);
BindFloat = __decorate([
    mobx_react_1.observer
], BindFloat);
exports.BindFloat = BindFloat;
let BindAutoFloat = class BindAutoFloat extends React.Component {
    onValue(value) {
        this.props.store[this.props.field] = value;
    }
    onToggleAuto(value) {
        this.props.store[this.props.field] = (value
            ? undefined
            : this.props.auto);
    }
    render() {
        const _a = this.props, { field, store, label, auto } = _a, rest = __rest(_a, ["field", "store", "label", "auto"]);
        const value = store[field];
        return (React.createElement(AutoFloatField, Object.assign({ label: label || Util_1.capitalize(field), value: value === undefined ? auto : value, isAuto: value === undefined, onValue: this.onValue, onToggleAuto: this.onToggleAuto }, rest)));
    }
};
__decorate([
    mobx_1.action.bound
], BindAutoFloat.prototype, "onValue", null);
__decorate([
    mobx_1.action.bound
], BindAutoFloat.prototype, "onToggleAuto", null);
BindAutoFloat = __decorate([
    mobx_react_1.observer
], BindAutoFloat);
exports.BindAutoFloat = BindAutoFloat;
let Modal = class Modal extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.dismissable = true;
    }
    onClickOutside() {
        if (this.dismissable)
            this.props.onClose();
    }
    componentDidMount() {
        // HACK (Mispy): The normal ways of doing this (stopPropagation etc) don't seem to work here
        this.base.current.addEventListener("click", () => {
            this.dismissable = false;
            setTimeout(() => (this.dismissable = true), 100);
        });
        setTimeout(() => document.body.addEventListener("click", this.onClickOutside), 0);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.onClickOutside);
    }
    render() {
        const { props } = this;
        return (React.createElement("div", { className: "modal" + (props.className ? ` ${props.className}` : ""), style: { display: "block" } },
            React.createElement("div", { ref: this.base, className: "modal-dialog", role: "document" },
                React.createElement("div", { className: "modal-content" }, this.props.children))));
    }
};
__decorate([
    mobx_1.action.bound
], Modal.prototype, "onClickOutside", null);
Modal = __decorate([
    mobx_react_1.observer
], Modal);
exports.Modal = Modal;
let LoadingBlocker = class LoadingBlocker extends React.Component {
    render() {
        return (React.createElement("div", { className: "LoadingBlocker" },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCog_1.faCog, spin: true, fixedWidth: true, size: "3x" })));
    }
};
LoadingBlocker = __decorate([
    mobx_react_1.observer
], LoadingBlocker);
exports.LoadingBlocker = LoadingBlocker;
const timeago_js_1 = require("timeago.js");
let Timeago = class Timeago extends React.Component {
    render() {
        return this.props.time ? timeago_js_1.format(this.props.time) : "";
    }
};
Timeago = __decorate([
    mobx_react_1.observer
], Timeago);
exports.Timeago = Timeago;
const TagBadge_1 = require("./TagBadge");
// NOTE (Mispy): Using my own fork of this which is modified to autoselect the first option.
// Better UX for case when you aren't adding new tags, only selecting from list.
const react_tag_autocomplete_1 = __importDefault(require("react-tag-autocomplete"));
const Tippy_1 = require("../grapher/chart/Tippy");
const faExclamationTriangle_1 = require("@fortawesome/free-solid-svg-icons/faExclamationTriangle");
let EditTags = class EditTags extends React.Component {
    constructor() {
        super(...arguments);
        this.dismissable = true;
    }
    onClickSomewhere(e) {
        if (this.dismissable)
            this.props.onSave();
        this.dismissable = true;
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
        const { tags, suggestions } = this.props;
        return (React.createElement("div", { className: "EditTags", onClick: this.onClick },
            React.createElement(react_tag_autocomplete_1.default, { tags: tags, suggestions: suggestions, handleAddition: this.props.onAdd, handleDelete: this.props.onDelete, minQueryLength: 1 })));
    }
};
__decorate([
    mobx_1.action.bound
], EditTags.prototype, "onClickSomewhere", null);
__decorate([
    mobx_1.action.bound
], EditTags.prototype, "onClick", null);
EditTags = __decorate([
    mobx_react_1.observer
], EditTags);
let EditableTags = class EditableTags extends React.Component {
    constructor() {
        super(...arguments);
        this.isEditing = false;
        this.base = React.createRef();
        this.tags = lodash.clone(this.props.tags);
    }
    onAddTag(tag) {
        this.tags.push(tag);
        this.tags = lodash
            .uniqBy(this.tags, (t) => t.id)
            .filter((t) => t.name !== "Uncategorized");
        this.ensureUncategorized();
    }
    onRemoveTag(index) {
        this.tags.splice(index, 1);
        this.ensureUncategorized();
    }
    ensureUncategorized() {
        if (this.tags.length === 0) {
            const uncategorized = this.props.suggestions.find((t) => t.name === "Uncategorized");
            if (uncategorized)
                this.tags.push(uncategorized);
        }
    }
    onToggleEdit() {
        if (this.isEditing) {
            this.props.onSave(this.tags.filter((t) => t.name !== "Uncategorized"));
        }
        this.isEditing = !this.isEditing;
    }
    componentDidMount() {
        this.componentDidUpdate();
    }
    componentDidUpdate() {
        this.ensureUncategorized();
    }
    render() {
        const { disabled } = this.props;
        const { tags } = this;
        return (React.createElement("div", { className: "EditableTags" }, this.isEditing ? (React.createElement(EditTags, { tags: this.tags, onAdd: this.onAddTag, onDelete: this.onRemoveTag, onSave: this.onToggleEdit, suggestions: this.props.suggestions })) : (React.createElement("div", null,
            tags.map((t) => (React.createElement(TagBadge_1.TagBadge, { key: t.id, tag: t }))),
            !disabled && (React.createElement("button", { className: "btn btn-link", onClick: this.onToggleEdit }, "Edit Tags"))))));
    }
};
__decorate([
    mobx_1.observable
], EditableTags.prototype, "isEditing", void 0);
__decorate([
    mobx_1.observable
], EditableTags.prototype, "tags", void 0);
__decorate([
    mobx_1.action.bound
], EditableTags.prototype, "onAddTag", null);
__decorate([
    mobx_1.action.bound
], EditableTags.prototype, "onRemoveTag", null);
__decorate([
    mobx_1.action.bound
], EditableTags.prototype, "ensureUncategorized", null);
__decorate([
    mobx_1.action.bound
], EditableTags.prototype, "onToggleEdit", null);
EditableTags = __decorate([
    mobx_react_1.observer
], EditableTags);
exports.EditableTags = EditableTags;
let Button = class Button extends React.Component {
    render() {
        return (React.createElement("button", { className: "btn btn-link", onClick: this.props.onClick }, this.props.children));
    }
};
Button = __decorate([
    mobx_react_1.observer
], Button);
exports.Button = Button;
//# sourceMappingURL=Forms.js.map