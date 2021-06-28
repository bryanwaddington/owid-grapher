"use strict";
/* ChartEditor.ts
 * ================
 *
 * Mobx store that represents the current editor state and governs non-UI-related operations.
 *
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartEditor = exports.EditorDatabase = void 0;
const mobx_1 = require("mobx");
const EditorFeatures_1 = require("./EditorFeatures");
const clientSettings_1 = require("../settings/clientSettings");
class EditorDatabase {
    constructor(json) {
        this.dataByNamespace = new Map();
        this.namespaces = json.namespaces;
    }
}
__decorate([
    mobx_1.observable.ref
], EditorDatabase.prototype, "namespaces", void 0);
__decorate([
    mobx_1.observable
], EditorDatabase.prototype, "dataByNamespace", void 0);
exports.EditorDatabase = EditorDatabase;
class ChartEditor {
    constructor(props) {
        this.tab = "basic";
        this.savedGrapherJson = "";
        this.manager = props.manager;
        this.previewMode =
            localStorage.getItem("editorPreviewMode") === "desktop"
                ? "desktop"
                : "mobile";
        mobx_1.when(() => this.grapher.isReady, () => (this.savedGrapherJson = JSON.stringify(this.grapher.object)));
    }
    get isModified() {
        return JSON.stringify(this.grapher.object) !== this.savedGrapherJson;
    }
    get grapher() {
        return this.manager.grapher;
    }
    get database() {
        return this.manager.database;
    }
    get logs() {
        return this.manager.logs;
    }
    get references() {
        return this.manager.references;
    }
    get redirects() {
        return this.manager.redirects;
    }
    get availableTabs() {
        const tabs = ["basic", "data", "text", "customize"];
        if (this.grapher.hasMapTab)
            tabs.push("map");
        if (this.grapher.isScatter || this.grapher.isTimeScatter)
            tabs.push("scatter");
        tabs.push("revisions");
        tabs.push("refs");
        return tabs;
    }
    get isNewGrapher() {
        return this.grapher.id === undefined;
    }
    get features() {
        return new EditorFeatures_1.EditorFeatures(this);
    }
    // Load index of datasets and variables for the given namespace
    loadNamespace(namespace) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.manager.admin.getJSON(`/api/editorData/${namespace}.json`);
            mobx_1.runInAction(() => this.database.dataByNamespace.set(namespace, data));
        });
    }
    saveGrapher({ onError, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { grapher, isNewGrapher } = this;
            const currentGrapherObject = Object.assign(Object.assign({}, this.grapher.object), { selectedData: this.grapher.legacyConfigAsAuthored.selectedData });
            // Chart title and slug may be autocalculated from data, in which case they won't be in props
            // But the server will need to know what we calculated in order to do its job
            if (!currentGrapherObject.title)
                currentGrapherObject.title = grapher.displayTitle;
            if (!currentGrapherObject.slug)
                currentGrapherObject.slug = grapher.displaySlug;
            // We need to save availableEntities for Algolia search. Todo: remove.
            const availableEntities = grapher.table.availableEntityNames;
            if (availableEntities.length)
                currentGrapherObject.data = { availableEntities };
            const targetUrl = isNewGrapher
                ? "/api/charts"
                : `/api/charts/${grapher.id}`;
            const json = yield this.manager.admin.requestJSON(targetUrl, currentGrapherObject, isNewGrapher ? "POST" : "PUT");
            if (json.success) {
                if (isNewGrapher) {
                    this.newChartId = json.chartId;
                }
                else {
                    mobx_1.runInAction(() => {
                        grapher.version += 1;
                        this.logs.unshift(json.newLog);
                        this.savedGrapherJson = JSON.stringify(currentGrapherObject);
                    });
                }
            }
            else {
                if (onError)
                    onError();
            }
        });
    }
    saveAsNewGrapher() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentGrapherObject = this.grapher.object;
            const chartJson = Object.assign({}, currentGrapherObject);
            delete chartJson.id;
            delete chartJson.isPublished;
            // Need to open intermediary tab before AJAX to avoid popup blockers
            const w = window.open("/", "_blank");
            const json = yield this.manager.admin.requestJSON("/api/charts", chartJson, "POST");
            if (json.success)
                w.location.assign(this.manager.admin.url(`charts/${json.chartId}/edit`));
        });
    }
    publishGrapher() {
        const url = `${clientSettings_1.BAKED_GRAPHER_URL}/${this.grapher.displaySlug}`;
        if (window.confirm(`Publish chart at ${url}?`)) {
            this.grapher.isPublished = true;
            this.saveGrapher({
                onError: () => (this.grapher.isPublished = undefined),
            });
        }
    }
    unpublishGrapher() {
        const message = this.references && this.references.length > 0
            ? "WARNING: This chart might be referenced from public posts, please double check before unpublishing. Remove chart anyway?"
            : "Are you sure you want to unpublish this chart?";
        if (window.confirm(message)) {
            this.grapher.isPublished = undefined;
            this.saveGrapher({
                onError: () => (this.grapher.isPublished = true),
            });
        }
    }
}
__decorate([
    mobx_1.observable.ref
], ChartEditor.prototype, "currentRequest", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditor.prototype, "tab", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditor.prototype, "errorMessage", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditor.prototype, "previewMode", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditor.prototype, "savedGrapherJson", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditor.prototype, "newChartId", void 0);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "isModified", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "grapher", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "database", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "logs", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "references", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "redirects", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "availableTabs", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "isNewGrapher", null);
__decorate([
    mobx_1.computed
], ChartEditor.prototype, "features", null);
exports.ChartEditor = ChartEditor;
//# sourceMappingURL=ChartEditor.js.map