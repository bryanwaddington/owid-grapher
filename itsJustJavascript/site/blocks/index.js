"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBlocks = exports.renderBlocks = void 0;
const AdditionalInformation_1 = require("./AdditionalInformation");
const Help_1 = require("./Help");
const SearchCountry_1 = require("../../site/SearchCountry");
const ExpandableInlineBlock_1 = require("../../site/ExpandableInlineBlock");
const runDataTokens_1 = require("../../site/runDataTokens");
const MultiEmbedder_1 = require("../../site/multiembedder/MultiEmbedder");
const renderBlocks = (cheerioEl) => {
    AdditionalInformation_1.render(cheerioEl);
    Help_1.renderHelp(cheerioEl);
};
exports.renderBlocks = renderBlocks;
const runBlocks = () => {
    if (!MultiEmbedder_1.shouldProgressiveEmbed()) {
        // Used by Help blocks. Pierces encapsulation but considered not worth going through hydration / client side rendering for this.
        // If hydration required for other purposes, then reassess.
        document
            .getElementsByTagName("body")[0]
            .classList.add("is-not-chart-interactive");
    }
    runDataTokens_1.runDataTokens();
    ExpandableInlineBlock_1.runExpandableInlineBlock();
    SearchCountry_1.runSearchCountry();
    AdditionalInformation_1.hydrate();
};
exports.runBlocks = runBlocks;
//# sourceMappingURL=index.js.map