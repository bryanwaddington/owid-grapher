#! /usr/bin/env jest
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __importStar(require("cheerio"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const React = __importStar(require("react"));
const formatGlossary_1 = require("./formatGlossary");
const glossary_1 = require("./glossary");
const population = "population";
const populations = "populations";
const population_growth = "population growth";
const Population_Growth = "Population Growth";
const P_SLUG = "population";
const PG_SLUG = "population-growth";
const P_EXCERPT = `excert about ${population}`;
const PG_EXCERPT = `excert about ${population_growth}`;
const P_LINK = ReactDOMServer.renderToStaticMarkup(React.createElement(formatGlossary_1.GlossaryLink, { slug: P_SLUG, excerpt: P_EXCERPT, match: population }));
const P_LINK_PERIOD = ReactDOMServer.renderToStaticMarkup(React.createElement(formatGlossary_1.GlossaryLink, { slug: P_SLUG, excerpt: P_EXCERPT, match: `${population}.` }));
const PS_LINK = ReactDOMServer.renderToStaticMarkup(React.createElement(formatGlossary_1.GlossaryLink, { slug: P_SLUG, excerpt: P_EXCERPT, match: populations }));
const PG_LINK = ReactDOMServer.renderToStaticMarkup(React.createElement(formatGlossary_1.GlossaryLink, { slug: PG_SLUG, excerpt: PG_EXCERPT, match: population_growth }));
const PG_LINK_CAPITALIZED = ReactDOMServer.renderToStaticMarkup(React.createElement(formatGlossary_1.GlossaryLink, { slug: PG_SLUG, excerpt: PG_EXCERPT, match: Population_Growth }));
const glossary = [
    { slug: P_SLUG, excerpt: P_EXCERPT, terms: [population, populations] },
    {
        slug: PG_SLUG,
        excerpt: PG_EXCERPT,
        terms: [population_growth],
    },
];
it("formats glossary terms using the longest possible expression", () => {
    const input = `Vivamus ${population_growth} commodo posuere sed vel magna.`;
    const output = `Vivamus ${PG_LINK} commodo posuere sed vel magna.`;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("includes periods in matched term", () => {
    const input = `Vivamus commodo posuere sed vel magna ${population}.`;
    const output = `Vivamus commodo posuere sed vel magna ${P_LINK_PERIOD}`;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("formats glossary term synonyms", () => {
    const input = `Vivamus ${populations} commodo posuere sed vel magna.`;
    const output = `Vivamus ${PS_LINK} commodo posuere sed vel magna.`;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("formats glossary terms within non anchor tags", () => {
    const input = `Within a non anchor tag: ex a, <strong>sollicitudin ${population_growth}</strong> eros.`;
    const output = `Within a non anchor tag: ex a, <strong>sollicitudin ${PG_LINK}</strong> eros.`;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("only formats the first occurence of a glossary term", () => {
    const input = `Multiple per line: lectus ${population_growth} mauris. Vestibulum ${population_growth} imperdiet.`;
    const output = `Multiple per line: lectus ${PG_LINK} mauris. Vestibulum ${population_growth} imperdiet.`;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("does not format glossary terms with missing word boundaries", () => {
    const input = `Not separated by word boundaries (e.g. space): lectus${population_growth} mauris.`;
    const output = input;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("does not format glossary terms within anchor tags", () => {
    const input = `Within an anchor tag: Phasellus sed <a href="/">diam ${population_growth} nibh</a> aliquet.`;
    const output = input;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("does not format glossary terms within forbidden tags", () => {
    formatGlossary_1.FORBIDDEN_TAGS.forEach((tag) => {
        const input = `Within a forbidden tag: Phasellus sed <${tag}>diam ${population_growth} nibh</${tag}> aliquet.`;
        const output = input;
        const $ = cheerio.load(input);
        formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
        expect($("body").html()).toEqual(output);
    });
});
it("matches glossary terms case insensitive and renders them with original case", () => {
    const input = `With case variations: Vivamus ac justo ac ${Population_Growth} sed vel magna.`;
    const output = `With case variations: Vivamus ac justo ac ${PG_LINK_CAPITALIZED} sed vel magna.`;
    const $ = cheerio.load(input);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(output);
});
it("adds glossary links to entire sections", () => {
    const sectionHtml = `<h3>Within heading: eget ${population_growth} justo eleifend</h3>
    <p>Praesent ut orci porta ${Population_Growth} et ac nunc. Morbi consectetur ${population} nec libero blandit.</p>
    <p>vitae vehicula nunc sodales. Nulla facilisi. Fusce cursus, neque vitae tincidunt vehicula,
    nunc purus tempus ${population_growth}, et facilisis libero justo ${population} dolor. Sed convallis aliquam eros.
    In a ipsum lectus. Aenean luctus dui vitae nulla gravida, sed blandit ex dignissim.</p>`;
    const sectionHtmlWithGlossary = `<h3>Within heading: eget ${population_growth} justo eleifend</h3>
    <p>Praesent ut orci porta ${PG_LINK_CAPITALIZED} et ac nunc. Morbi consectetur ${P_LINK} nec libero blandit.</p>
    <p>vitae vehicula nunc sodales. Nulla facilisi. Fusce cursus, neque vitae tincidunt vehicula,
    nunc purus tempus ${population_growth}, et facilisis libero justo ${population} dolor. Sed convallis aliquam eros.
    In a ipsum lectus. Aenean luctus dui vitae nulla gravida, sed blandit ex dignissim.</p>`;
    const $ = cheerio.load(sectionHtml);
    formatGlossary_1.formatGlossaryTerms($, $("body").contents(), glossary_1.getMutableGlossary(glossary));
    expect($("body").html()).toEqual(sectionHtmlWithGlossary);
});
//# sourceMappingURL=formatGlossary.test.js.map