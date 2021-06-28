"use strict";
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
exports.GrapherAnalytics = void 0;
const Util_1 = require("../../clientUtils/Util");
const DEBUG = false;
var Categories;
(function (Categories) {
    Categories["GrapherError"] = "GrapherErrors";
    Categories["GrapherUsage"] = "GrapherUsage";
    Categories["GlobalEntitySelectorUsage"] = "GlobalEntitySelector";
    Categories["SiteClick"] = "SiteClick";
    Categories["KeyboardShortcut"] = "KeyboardShortcut";
})(Categories || (Categories = {}));
var EventNames;
(function (EventNames) {
    EventNames["grapherViewError"] = "GRAPHER_VIEW_ERROR";
    EventNames["entitiesNotFound"] = "ENTITIES_NOT_FOUND";
    EventNames["timelinePlay"] = "TimelinePlay";
})(EventNames || (EventNames = {}));
// Note: consent-based blocking dealt with at the Google Tag Manager level.
// Events are discarded if consent not given.
class GrapherAnalytics {
    constructor(environment = "", version = "1.0.0") {
        this.isDev = environment === "development";
        this.version = version;
    }
    logGrapherViewError(error, info) {
        this.logToAmplitude(EventNames.grapherViewError, { error, info });
        this.logToGA(Categories.GrapherError, EventNames.grapherViewError);
    }
    logEntitiesNotFoundError(entities) {
        this.logToAmplitude(EventNames.entitiesNotFound, { entities });
        this.logToGA(Categories.GrapherError, EventNames.entitiesNotFound, JSON.stringify(entities));
    }
    logGrapherTimelinePlay(slug) {
        this.logToGA(Categories.GrapherUsage, EventNames.timelinePlay, slug);
    }
    logGlobalEntitySelector(action, note) {
        this.logToGA(Categories.GlobalEntitySelectorUsage, action, note);
    }
    logEntityPickerEvent(pickerSlug, action, note) {
        this.logToGA(`${pickerSlug}ExplorerCountrySelectorUsage`, action, note);
    }
    logSiteClick(action = "unknown-action", label) {
        this.logToGA(Categories.SiteClick, action, label);
    }
    logKeyboardShortcut(shortcut, combo) {
        this.logToGA(Categories.KeyboardShortcut, shortcut, combo);
    }
    startClickTracking() {
        // Todo: add a Story and tests for this OR even better remove and use Google Tag Manager or similar fully SAAS tracking.
        // Todo: have different Attributes for Grapher charts vs Site.
        const dataTrackAttr = "data-track-note";
        document.addEventListener("click", (ev) => __awaiter(this, void 0, void 0, function* () {
            const targetElement = ev.target;
            const trackedElement = Util_1.findDOMParent(targetElement, (el) => el.getAttribute(dataTrackAttr) !== null);
            if (!trackedElement)
                return;
            // Note that browsers will cancel all pending requests once a user
            // navigates away from a page. An earlier implementation had a
            // timeout to send the event before navigating, but it broke
            // CMD+CLICK for opening a new tab.
            this.logSiteClick(trackedElement.getAttribute(dataTrackAttr) || undefined, trackedElement.innerText);
        }));
    }
    logToAmplitude(name, props) {
        const allProps = Object.assign({ context: {
                siteVersion: this.version,
                pageHref: window.location.href,
                pagePath: window.location.pathname,
                pageTitle: document.title.replace(/ - [^-]+/, ""),
            } }, props);
        if (DEBUG && this.isDev) {
            // eslint-disable-next-line no-console
            console.log("Analytics.logToAmplitude", name, allProps);
            return;
        }
        if (!window.amplitude)
            return;
        window.amplitude.getInstance().logEvent(name, allProps);
    }
    logToGA(eventCategory, eventAction, eventLabel, eventValue) {
        // Todo: send the Grapher (or site) version to Git
        const event = {
            hitType: "event",
            eventCategory,
            eventAction,
            eventLabel,
            eventValue,
        };
        if (DEBUG && this.isDev) {
            // eslint-disable-next-line no-console
            console.log("Analytics.logToGA", event);
            return;
        }
        if (!window.ga)
            return;
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ga-object-methods-reference
        window.ga(function () {
            const tracker = window.ga.getAll()[0];
            // @types/google.analytics seems to suggest this usage is invalid but we know Google
            // Analytics logs these events correctly.
            // I have avoided changing the implementation for now, but we should look into this as
            // we use Google Analytics more.
            // -@danielgavrilov 2020-04-23
            if (tracker)
                tracker.send(event);
        });
    }
}
exports.GrapherAnalytics = GrapherAnalytics;
//# sourceMappingURL=GrapherAnalytics.js.map