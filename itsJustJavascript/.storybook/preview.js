"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_api_1 = require("@storybook/client-api");
const addon_viewport_1 = require("@storybook/addon-viewport");
require("site/owid.scss");
require("grapher/core/grapher.scss");
require("handsontable/dist/handsontable.full.css");
client_api_1.addParameters({
    viewport: {
        viewports: addon_viewport_1.INITIAL_VIEWPORTS,
    },
    options: {
        storySort: {
            method: "alphabetical",
        },
    },
});
//# sourceMappingURL=preview.js.map