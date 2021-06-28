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
exports.formatPost = exports.formatWordpressPost = void 0;
const SectionHeading_1 = require("../site/SectionHeading");
const cheerio = __importStar(require("cheerio"));
const url_slug_1 = __importDefault(require("url-slug"));
const lodash = __importStar(require("lodash"));
const React = __importStar(require("react"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const serverSettings_1 = require("../settings/serverSettings");
const wpdb_1 = require("../db/wpdb");
const Tablepress_1 = __importDefault(require("../site/Tablepress"));
const path = __importStar(require("path"));
const blocks_1 = require("../site/blocks");
const RelatedCharts_1 = require("../site/blocks/RelatedCharts");
const owidTypes_1 = require("../clientUtils/owidTypes");
const bakeGlobalEntitySelector_1 = require("./bakeGlobalEntitySelector");
const Footnote_1 = require("../site/Footnote");
const LoadingIndicator_1 = require("../grapher/loadingIndicator/LoadingIndicator");
const ProminentLink_1 = require("../site/blocks/ProminentLink");
const countryProfileProjects_1 = require("../site/countryProfileProjects");
const formatGlossary_1 = require("../site/formatGlossary");
const glossary_1 = require("../site/glossary");
const DataToken_1 = require("../site/DataToken");
const formatting_1 = require("./formatting");
const mathjax_1 = require("mathjax-full/js/mathjax");
const tex_1 = require("mathjax-full/js/input/tex");
const svg_1 = require("mathjax-full/js/output/svg");
const liteAdaptor_1 = require("mathjax-full/js/adaptors/liteAdaptor");
const html_1 = require("mathjax-full/js/handlers/html");
const AllPackages_1 = require("mathjax-full/js/input/tex/AllPackages");
const replaceExplorerRedirects_1 = require("./replaceExplorerRedirects");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const Variable_1 = require("../db/model/Variable");
const AnnotatingDataValue_1 = require("../site/AnnotatingDataValue");
const initMathJax = () => {
    const adaptor = liteAdaptor_1.liteAdaptor();
    html_1.RegisterHTMLHandler(adaptor);
    const tex = new tex_1.TeX({ packages: AllPackages_1.AllPackages });
    const svg = new svg_1.SVG({ fontCache: "none" });
    const doc = mathjax_1.mathjax.document("", {
        InputJax: tex,
        OutputJax: svg,
    });
    return function format(latex) {
        const node = doc.convert(latex, {
            display: true,
        });
        return adaptor.outerHTML(node); // as HTML
    };
};
const formatMathJax = initMathJax();
// A modifed FontAwesome icon
const INTERACTIVE_ICON_SVG = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hand-pointer" class="svg-inline--fa fa-hand-pointer fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 617">
    <path fill="currentColor" d="M448,344.59v96a40.36,40.36,0,0,1-1.06,9.16l-32,136A40,40,0,0,1,376,616.59H168a40,40,0,0,1-32.35-16.47l-128-176a40,40,0,0,1,64.7-47.06L104,420.58v-276a40,40,0,0,1,80,0v200h8v-40a40,40,0,1,1,80,0v40h8v-24a40,40,0,1,1,80,0v24h8a40,40,0,1,1,80,0Zm-256,80h-8v96h8Zm88,0h-8v96h8Zm88,0h-8v96h8Z" transform="translate(0 -0.41)"/>
    <path fill="currentColor" opacity="0.6" d="M239.76,234.78A27.5,27.5,0,0,1,217,192a87.76,87.76,0,1,0-145.9,0A27.5,27.5,0,1,1,25.37,222.6,142.17,142.17,0,0,1,1.24,143.17C1.24,64.45,65.28.41,144,.41s142.76,64,142.76,142.76a142.17,142.17,0,0,1-24.13,79.43A27.47,27.47,0,0,1,239.76,234.78Z" transform="translate(0 -0.41)"/>
</svg>`;
const extractLatex = (html) => {
    const latexBlocks = [];
    html = html.replace(/\[latex\]([\s\S]*?)\[\/latex\]/gm, (_, latex) => {
        latexBlocks.push(latex.replace("\\[", "").replace("\\]", "").replace(/\$\$/g, ""));
        return "[latex]";
    });
    return [html, latexBlocks];
};
const formatLatex = (html, latexBlocks) => __awaiter(void 0, void 0, void 0, function* () {
    if (!latexBlocks)
        [html, latexBlocks] = extractLatex(html);
    // return early so we don't do unnecessary work for sites without latex
    if (!latexBlocks.length)
        return html;
    const compiled = [];
    for (const latex of latexBlocks) {
        try {
            compiled.push(formatMathJax(latex));
        }
        catch (err) {
            compiled.push(`${latex} (Could not format equation due to MathJax error)`);
        }
    }
    let i = -1;
    return html.replace(/\[latex\]/g, () => {
        i += 1;
        return compiled[i];
    });
});
const formatWordpressPost = (post, html, formattingOptions, grapherExports) => __awaiter(void 0, void 0, void 0, function* () {
    // Strip comments
    html = html.replace(/<!--[^>]+-->/g, "");
    // Need to skirt around wordpress formatting to get proper latex rendering
    let latexBlocks;
    [html, latexBlocks] = extractLatex(html);
    const references = [];
    html = html.replace(/\[cite\]([\s\S]*?)\[\/cite\]/gm, () => {
        references.push({}); // Todo
        return ``;
    });
    html = yield formatLatex(html, latexBlocks);
    // Footnotes
    const footnotes = [];
    html = html.replace(/{ref}([\s\S]*?){\/ref}/gm, (_, footnote) => {
        if (formattingOptions.footnotes) {
            footnotes.push(footnote);
            const i = footnotes.length;
            const href = `#note-${i}`;
            return ReactDOMServer.renderToStaticMarkup(React.createElement("a", { id: `ref-${i}`, className: "ref", href: href },
                React.createElement(Footnote_1.Footnote, { index: i })));
        }
        else {
            return "";
        }
    });
    const dataValuesConfigurationsMap = yield formatting_1.extractDataValuesConfiguration(html);
    const dataValues = new Map();
    for (const [dataValueConfigurationString, dataValueConfiguration,] of dataValuesConfigurationsMap) {
        const { value, year, unit, entityName } = (yield Variable_1.getDataValue(dataValueConfiguration.queryArgs)) || {};
        const template = dataValueConfiguration.template;
        if (!value || !year || !entityName)
            throw new owidTypes_1.JsonError(`Missing data value for query ${dataValueConfigurationString}`);
        if (!template)
            throw new owidTypes_1.JsonError(`Missing template for query ${dataValueConfigurationString}`);
        dataValues.set(dataValueConfigurationString, {
            value,
            template,
            year,
            unit,
            entityName,
        });
    }
    html = html.replace(formatting_1.dataValueRegex, (_, dataValueConfigurationString) => {
        const dataValueProps = dataValues.get(dataValueConfigurationString);
        if (!dataValueProps)
            throw new owidTypes_1.JsonError(`Missing data value for query ${dataValueConfigurationString}`);
        return ReactDOMServer.renderToString(React.createElement(AnnotatingDataValue_1.AnnotatingDataValue, { dataValueProps: dataValueProps }));
    });
    // Needs to be happen after DataValue replacements, as the DataToken regex
    // would otherwise capture DataValue tags
    const dataTokenRegex = /{{\s*([a-zA-Z]+)\s*(.+?)\s*}}/g;
    html = html.replace(dataTokenRegex, (_, token, dataTokenConfigurationString) => {
        return ReactDOMServer.renderToString(React.createElement(DataToken_1.DataToken, Object.assign({ token: token }, formatting_1.parseKeyValueArgs(dataTokenConfigurationString))));
    });
    // Insert [table id=foo] tablepress tables
    const tables = yield wpdb_1.getTables();
    html = html.replace(/\[table\s+id=(\d+)\s*\/\]/g, (match, tableId) => {
        const table = tables.get(tableId);
        if (table)
            return ReactDOMServer.renderToStaticMarkup(React.createElement(Tablepress_1.default, { data: table.data }));
        return "UNKNOWN TABLE";
    });
    // No need for wordpress urls
    html = html.replace(new RegExp("/app/uploads", "g"), "/uploads");
    // Give "Add country" text (and variations) the appearance of "+ Add Country" chart control
    html = html.replace(/(\+ )?[a|A]dd [c|C]ountry/g, `<span class="add-country">
            <span class="icon">
                <svg width="16" height="16"><path d="M3,8 h10 m-5,-5 v10"></path></svg>
            </span>
            Add country
        </span>`);
    const cheerioEl = cheerio.load(html);
    // Related charts
    // Mimicking SSR output of additional information block from PHP
    if (!countryProfileProjects_1.countryProfileSpecs.some((spec) => post.slug === spec.landingPageSlug) &&
        post.relatedCharts &&
        post.relatedCharts.length !== 0) {
        const allCharts = `
        <block type="additional-information">
            <content>
                <h3>All our charts on ${post.title}</h3>
                ${ReactDOMServer.renderToStaticMarkup(React.createElement("div", null,
            React.createElement(RelatedCharts_1.RelatedCharts, { charts: post.relatedCharts })))}
            </content>
        </block>
        `;
        const $summary = cheerioEl(".wp-block-owid-summary");
        if ($summary.length !== 0) {
            $summary.after(allCharts);
        }
        else {
            cheerioEl("body > h2:first-of-type, body > h3:first-of-type")
                .first()
                .before(allCharts);
        }
    }
    // SSR rendering of Gutenberg blocks, before hydration on client
    blocks_1.renderBlocks(cheerioEl);
    // Extract blog info content
    let info = null;
    const $info = cheerioEl(".blog-info");
    if ($info.length) {
        info = $info.html();
        $info.remove();
    }
    // Extract last updated
    let lastUpdated;
    const $lastUpdated = cheerioEl(".wp-block-last-updated p");
    if ($lastUpdated.length) {
        lastUpdated = $lastUpdated.html();
        $lastUpdated.remove();
    }
    // Extract page supertitle
    let supertitle;
    const $supertitle = cheerioEl(".wp-block-owid-supertitle");
    if ($supertitle.length) {
        supertitle = $supertitle.text();
        $supertitle.remove();
    }
    // Extract page byline
    let byline;
    const $byline = cheerioEl(".wp-block-owid-byline");
    if ($byline.length) {
        byline = $byline.html();
        $byline.remove();
    }
    // Replace URLs pointing to Explorer redirect URLs with the destination URLs
    replaceExplorerRedirects_1.replaceIframesWithExplorerRedirectsInWordPressPost(cheerioEl);
    // Replace grapher iframes with static previews
    const GRAPHER_PREVIEW_CLASS = "grapherPreview";
    if (grapherExports) {
        const grapherIframes = cheerioEl("iframe")
            .toArray()
            .filter((el) => (el.attribs["src"] || "").match(/\/grapher\//));
        for (const el of grapherIframes) {
            const $el = cheerioEl(el);
            const src = el.attribs["src"].trim();
            const chart = grapherExports.get(src);
            if (chart) {
                const output = `
                <figure data-grapher-src="${src}" class="${GRAPHER_PREVIEW_CLASS}">
                    <a href="${src}" target="_blank">
                        <div><img src="${chart.svgUrl}" width="${chart.width}" height="${chart.height}" loading="lazy" data-no-lightbox /></div>
                        <div class="interactionNotice">
                            <span class="icon">${INTERACTIVE_ICON_SVG}</span>
                            <span class="label">Click to open interactive version</span>
                        </div>
                    </a>
                </figure>`;
                if (el.parent.tagName === "p") {
                    // We are about to replace <iframe> with <figure>. However, there cannot be <figure> within <p>,
                    // so we are lifting the <figure> out.
                    // Where does this markup  come from? Historically, wpautop wrapped <iframe> in <p>. Some non-Gutengerg
                    // posts will still show that, until they are converted. As a reminder, wpautop is not being used
                    // on the overall post content anymore, neither on the Wordpress side nor on the grapher side (through
                    // the wpautop npm package), but its effects are still "present" after the result of wpautop were committed
                    // to the DB during a one-time refactoring session.
                    // <p><iframe></iframe></p>  -->  <p></p><figure></figure>
                    const $p = $el.parent();
                    $p.after(output);
                    $el.remove();
                }
                else if (el.parent.tagName === "figure") {
                    // Support for <iframe> wrapped in <figure>
                    // <figure> automatically added by Gutenberg on copy / paste <iframe>
                    // Lifting up <iframe> out of <figure>, before it becomes a <figure> itself.
                    // <figure><iframe></iframe></figure>  -->  <figure></figure>
                    const $figure = $el.parent();
                    $figure.after(output);
                    $figure.remove();
                }
                else {
                    // No lifting up otherwise, just replacing <iframe> with <figure>
                    // <iframe></iframe>  -->  <figure></figure>
                    $el.after(output);
                    $el.remove();
                }
            }
        }
    }
    // Replace explorer iframes with iframeless embed
    const explorerIframes = cheerioEl("iframe")
        .toArray()
        .filter((el) => (el.attribs["src"] || "").includes(`/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/`));
    for (const el of explorerIframes) {
        const $el = cheerioEl(el);
        const src = el.attribs["src"].trim();
        // set a default style if none exists on the existing iframe
        const style = el.attribs["style"] || "width: 100%; height: 600px;";
        const cssClass = el.attribs["class"];
        const $figure = cheerioEl(ReactDOMServer.renderToStaticMarkup(React.createElement("figure", { "data-explorer-src": src, className: cssClass },
            React.createElement(LoadingIndicator_1.LoadingIndicator, null))));
        $figure.attr("style", style);
        $el.after($figure);
        $el.remove();
    }
    // Any remaining iframes
    for (const iframe of cheerioEl("iframe").toArray()) {
        // Ensure https embeds
        if (serverSettings_1.HTTPS_ONLY && iframe.attribs["src"]) {
            iframe.attribs["src"] = iframe.attribs["src"].replace("http://", "https://");
        }
        // Lazy load unless "loading" attribute already specified
        if (!iframe.attribs["loading"]) {
            iframe.attribs["loading"] = "lazy";
        }
    }
    // Remove any empty elements
    for (const p of cheerioEl("p").toArray()) {
        const $p = cheerioEl(p);
        if ($p.contents().length === 0)
            $p.remove();
    }
    // Wrap tables so we can do overflow-x: scroll if needed
    for (const table of cheerioEl("table").toArray()) {
        const $table = cheerioEl(table);
        const $div = cheerioEl("<div class='tableContainer'></div>");
        $table.after($div);
        $div.append($table);
    }
    // Make sticky-right layout the default for columns
    cheerioEl(".wp-block-columns").each((_, columns) => {
        const $columns = cheerioEl(columns);
        if (columns.attribs.class === "wp-block-columns") {
            $columns.addClass("is-style-sticky-right");
        }
    });
    // Image processing
    // Assumptions:
    // - original images are not uploaded with a suffix "-[number]x[number]"
    //   (without the quotes).
    // - variants are being generated by wordpress when the original is uploaded
    // - images are never legitimate direct descendants of <a> tags.
    //   <a><img /></a> is considered deprecated (was used to create direct links to
    //   the full resolution variant) and wrapping <a> will be removed to prevent
    //   conflicts with lightboxes. Chosen over preventDefault() in front-end code
    //   to avoid clicks before javascript executes.
    for (const el of cheerioEl("img").toArray()) {
        // Recreate source image path by removing automatically added image
        // dimensions (e.g. remove 800x600).
        const src = el.attribs["src"];
        const parsedPath = path.parse(src);
        let originalFilename = "";
        if (parsedPath.ext !== ".svg") {
            originalFilename = parsedPath.name.replace(/-\d+x\d+$/, "");
            const originalSrc = path.format({
                dir: parsedPath.dir,
                name: originalFilename,
                ext: parsedPath.ext,
            });
            el.attribs["data-high-res-src"] = originalSrc;
        }
        else {
            originalFilename = parsedPath.name;
        }
        // Remove wrapping <a> tag, conflicting with lightbox (cf. assumptions above)
        if (el.parent.tagName === "a") {
            const $a = cheerioEl(el.parent);
            $a.replaceWith(cheerioEl(el));
        }
        // Add alt attribute
        if (!el.attribs["alt"]) {
            el.attribs["alt"] = lodash.capitalize(originalFilename.replace(/[-_]/g, " "));
        }
        // Lazy load all images, unless they already have a "loading" attribute.
        if (!el.attribs["loading"]) {
            el.attribs["loading"] = "lazy";
        }
    }
    // Table of contents and deep links
    const tocHeadings = [];
    const existingSlugs = [];
    let parentHeading = null;
    cheerioEl("h1, h2, h3, h4").each((_, el) => {
        const $heading = cheerioEl(el);
        const headingText = $heading.text();
        let slug = url_slug_1.default(headingText);
        // Avoid If the slug already exists, try prepend the parent
        if (existingSlugs.indexOf(slug) !== -1 && parentHeading) {
            slug = `${parentHeading.slug}-${slug}`;
        }
        existingSlugs.push(slug);
        // Table of contents
        if (formattingOptions.toc) {
            if ($heading.is("#footnotes") && footnotes.length > 0) {
                tocHeadings.push({
                    text: headingText,
                    slug: "footnotes",
                    isSubheading: false,
                });
            }
            else if (!$heading.is("h1") && !$heading.is("h4")) {
                if ($heading.is("h2")) {
                    const tocHeading = {
                        text: headingText,
                        slug: slug,
                        isSubheading: false,
                    };
                    tocHeadings.push(tocHeading);
                    parentHeading = tocHeading;
                }
                else if ($heading.closest(`.${ProminentLink_1.PROMINENT_LINK_CLASSNAME}`).length ===
                    0 &&
                    $heading.closest(".wp-block-owid-additional-information")
                        .length === 0) {
                    tocHeadings.push({
                        text: headingText,
                        html: $heading.html() || undefined,
                        slug: slug,
                        isSubheading: true,
                    });
                }
            }
        }
        $heading.attr("id", slug);
        // Add deep link for headings not contained in <a> tags already
        // (e.g. within a prominent link block)
        if (!$heading.closest(`.${ProminentLink_1.PROMINENT_LINK_CLASSNAME}`).length && // already wrapped in <a>
            !$heading.closest(".wp-block-owid-additional-information").length && // prioritize clean SSR of AdditionalInformation
            !$heading.closest(".wp-block-help").length) {
            $heading.prepend(`<a class="${formatting_1.DEEP_LINK_CLASS}" href="#${slug}"></a>`);
        }
    });
    const getColumns = (style = "sticky-right") => {
        const emptyColumns = `<div class="wp-block-columns is-style-${style}"><div class="wp-block-column"></div><div class="wp-block-column"></div></div>`;
        const $columns = cheerioEl(emptyColumns);
        return {
            wrapper: $columns,
            first: $columns.children().first(),
            last: $columns.children().last(),
        };
    };
    const isColumnsEmpty = (columns) => {
        return columns.first.children().length === 0 &&
            columns.last.children().length === 0
            ? true
            : false;
    };
    const flushColumns = (columns, $section) => {
        $section.append(columns.wrapper);
        return getColumns();
    };
    // Wrap content demarcated by headings into section blocks
    // and automatically divide content into columns
    const sectionStarts = [cheerioEl("body").children().get(0)].concat(cheerioEl("body > h2").toArray());
    for (const start of sectionStarts) {
        const $start = cheerioEl(start);
        const $section = cheerioEl("<section>");
        let columns = getColumns();
        let sideBySideColumns = getColumns("side-by-side");
        const $tempWrapper = cheerioEl("<div>");
        const $contents = $tempWrapper
            .append($start.clone(), $start.nextUntil(cheerioEl("h2")))
            .contents();
        if (post.glossary) {
            formatGlossary_1.formatGlossaryTerms(cheerioEl, $contents, glossary_1.getMutableGlossary(glossary_1.glossary));
        }
        $contents.each((i, el) => {
            var _a, _b;
            const $el = cheerioEl(el);
            // Leave h2 at the section level, do not move into columns
            if (el.name === "h2") {
                $section.append(ReactDOMServer.renderToStaticMarkup(React.createElement(SectionHeading_1.SectionHeading, { title: $el.text(), tocHeadings: tocHeadings },
                    React.createElement("div", { dangerouslySetInnerHTML: {
                            __html: cheerioEl.html($el),
                        } }))));
            }
            else if (el.name === "h3" ||
                $el.hasClass("wp-block-columns") ||
                $el.hasClass("wp-block-owid-grid") ||
                $el.hasClass("wp-block-full-content-width") ||
                $el.find('.wp-block-owid-additional-information[data-variation="full-width"]').length !== 0) {
                if (!isColumnsEmpty(columns)) {
                    columns = flushColumns(columns, $section);
                }
                $section.append($el);
            }
            else if (el.name === "h4") {
                if (!isColumnsEmpty(columns)) {
                    columns = flushColumns(columns, $section);
                }
                columns.first.append($el);
                columns = flushColumns(columns, $section);
            }
            else {
                if (el.name === "figure" &&
                    $el.hasClass(GRAPHER_PREVIEW_CLASS)) {
                    if (isColumnsEmpty(sideBySideColumns)) {
                        // Only fill the side by side buffer if there is an upcoming chart for a potential comparison.
                        // Otherwise let the standard process (sticky right) take over.
                        if (((_b = (_a = $contents[i].nextSibling) === null || _a === void 0 ? void 0 : _a.attribs) === null || _b === void 0 ? void 0 : _b.class) ===
                            GRAPHER_PREVIEW_CLASS) {
                            columns = flushColumns(columns, $section);
                            sideBySideColumns.first.append($el);
                        }
                        else {
                            columns.last.append($el);
                        }
                    }
                    else {
                        sideBySideColumns.last.append($el);
                        $section.append(sideBySideColumns.wrapper);
                        sideBySideColumns = getColumns("side-by-side");
                    }
                }
                // Move images to the right column
                else if (el.name === "figure" ||
                    el.name === "iframe" ||
                    // Temporary support for old chart iframes
                    el.name === "address" ||
                    $el.hasClass("wp-block-image") ||
                    $el.hasClass("tableContainer") ||
                    // Temporary support for non-Gutenberg iframes wrapped in wpautop's <p>
                    // Also catches older iframes (e.g. https://ourworldindata.org/food-per-person#world-map-of-minimum-and-average-dietary-energy-requirement-mder-and-ader)
                    $el.find("iframe").length !== 0 ||
                    // TODO: remove temporary support for pre-Gutenberg images and associated captions
                    el.name === "h6" ||
                    ($el.find("img").length !== 0 &&
                        !$el.hasClass(ProminentLink_1.PROMINENT_LINK_CLASSNAME) &&
                        !$el.find(".wp-block-owid-additional-information[data-variation='merge-left']"))) {
                    columns.last.append($el);
                }
                else {
                    // Move non-heading, non-image content to the left column
                    columns.first.append($el);
                }
            }
        });
        if (!isColumnsEmpty(columns)) {
            $section.append(columns.wrapper);
        }
        $start.replaceWith($section);
    }
    // Render global country selection component.
    // Injects a <section>, which is why it executes last.
    bakeGlobalEntitySelector_1.bakeGlobalEntitySelector(cheerioEl);
    return {
        id: post.id,
        type: post.type,
        slug: post.slug,
        path: post.path,
        title: post.title,
        subtitle: post.subtitle,
        supertitle: supertitle,
        date: post.date,
        modifiedDate: post.modifiedDate,
        lastUpdated: lastUpdated,
        authors: post.authors,
        byline: byline,
        info: info,
        html: formatting_1.getHtmlContentWithStyles(cheerioEl),
        footnotes: footnotes,
        references: references,
        excerpt: post.excerpt || cheerioEl("p").first().text(),
        imageUrl: post.imageUrl,
        tocHeadings: tocHeadings,
        relatedCharts: post.relatedCharts,
    };
});
exports.formatWordpressPost = formatWordpressPost;
const formatPost = (post, formattingOptions, grapherExports) => __awaiter(void 0, void 0, void 0, function* () {
    const html = formatting_1.formatLinks(post.content);
    // No formatting applied, plain source HTML returned
    if (formattingOptions.raw)
        return Object.assign(Object.assign({}, post), { html, footnotes: [], references: [], tocHeadings: [], excerpt: post.excerpt || "" });
    // Override formattingOptions if specified in the post (as an HTML comment)
    const options = Object.assign({
        toc: post.type === "page",
        footnotes: true,
    }, formattingOptions);
    return exports.formatWordpressPost(post, html, options, grapherExports);
});
exports.formatPost = formatPost;
//# sourceMappingURL=formatWordpressPost.js.map