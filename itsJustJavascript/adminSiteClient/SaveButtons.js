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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveButtons = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
let SaveButtons = class SaveButtons extends React.Component {
    onSaveChart() {
        this.props.editor.saveGrapher();
    }
    onSaveAsNew() {
        this.props.editor.saveAsNewGrapher();
    }
    onPublishToggle() {
        if (this.props.editor.grapher.isPublished)
            this.props.editor.unpublishGrapher();
        else
            this.props.editor.publishGrapher();
    }
    render() {
        const { editor } = this.props;
        const { grapher } = editor;
        return (React.createElement("div", { className: "SaveButtons" },
            React.createElement("button", { className: "btn btn-success", onClick: this.onSaveChart, disabled: grapher.hasFatalErrors }, grapher.isPublished
                ? "Update chart"
                : grapher.id
                    ? "Save draft"
                    : "Create draft"),
            " ",
            React.createElement("button", { className: "btn btn-secondary", onClick: this.onSaveAsNew, disabled: grapher.hasFatalErrors }, "Save as new"),
            " ",
            React.createElement("button", { className: "btn btn-danger", onClick: this.onPublishToggle, disabled: grapher.hasFatalErrors }, grapher.isPublished ? "Unpublish" : "Publish")));
        /*return <section className="form-section-submit">
            <button type="button" className="btn btn-lg btn-success btn-primary" onClick={this.onSaveChart}>
                {editor.isSaved ? "Saved" :
                    chart.isPublished ? "Update chart" : "Save draft"}
            </button>
            {" "}<button type="button" className="btn btn-lg btn-primary" onClick={this.onSaveAsNew}>Save as new</button>
            {" "}<button type="button" className="btn btn-lg btn-danger" onClick={this.onPublishToggle}>{chart.isPublished ? "Unpublish" : "Publish"}</button>
        </section>*/
    }
};
__decorate([
    mobx_1.action.bound
], SaveButtons.prototype, "onSaveChart", null);
__decorate([
    mobx_1.action.bound
], SaveButtons.prototype, "onSaveAsNew", null);
__decorate([
    mobx_1.action.bound
], SaveButtons.prototype, "onPublishToggle", null);
SaveButtons = __decorate([
    mobx_react_1.observer
], SaveButtons);
exports.SaveButtons = SaveButtons;
//# sourceMappingURL=SaveButtons.js.map