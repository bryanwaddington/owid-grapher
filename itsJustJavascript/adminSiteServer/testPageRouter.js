"use strict";
// Testing pages for comparing local charts against live versions
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPageRouter = void 0;
const express_1 = require("express");
const React = __importStar(require("react"));
const serverUtil_1 = require("./serverUtil");
const Chart_1 = require("../db/model/Chart");
const Head_1 = require("../site/Head");
const db = __importStar(require("../db/db"));
const serverSettings_1 = require("../settings/serverSettings");
const Util_1 = require("../clientUtils/Util");
const GrapherImageBaker_1 = require("../baker/GrapherImageBaker");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const Url_1 = require("../clientUtils/urls/Url");
const UrlUtils_1 = require("../clientUtils/urls/UrlUtils");
const IS_LIVE = serverSettings_1.ADMIN_BASE_URL === "https://owid.cloud";
const DEFAULT_COMPARISON_URL = "https://ourworldindata.org";
const testPageRouter = express_1.Router();
exports.testPageRouter = testPageRouter;
function parseStringArrayOrUndefined(param) {
    if (param === undefined)
        return [];
    return param.split(",");
}
function parseIntArrayOrUndefined(param) {
    return Util_1.excludeUndefined(parseStringArrayOrUndefined(param).map(Util_1.parseIntOrUndefined));
}
function propsFromQueryParams(params) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const page = params.page
            ? serverUtil_1.expectInt(params.page)
            : params.random
                ? Math.floor(1 + Math.random() * 180) // Sample one of 180 pages. Some charts won't ever get picked but good enough.
                : 1;
        const perPage = (_a = Util_1.parseIntOrUndefined(params.perPage)) !== null && _a !== void 0 ? _a : 20;
        const ids = parseIntArrayOrUndefined(params.ids);
        const datasetIds = parseIntArrayOrUndefined(params.datasetIds);
        const namespaces = (_b = parseStringArrayOrUndefined(params.namespaces)) !== null && _b !== void 0 ? _b : (params.namespace ? [params.namespace] : []);
        let query = Chart_1.Chart.createQueryBuilder("charts")
            .where("publishedAt IS NOT NULL")
            .limit(perPage)
            .offset(perPage * (page - 1))
            .orderBy("id", "ASC");
        let tab = params.tab;
        if (params.type) {
            if (params.type === GrapherConstants_1.ChartTypeName.WorldMap) {
                query = query.andWhere(`config->"$.hasMapTab" IS TRUE`);
                tab = tab || GrapherConstants_1.GrapherTabOption.map;
            }
            else {
                if (params.type === "LineChart") {
                    query = query.andWhere(`(
                        config->"$.type" = "LineChart"
                        OR config->"$.type" IS NULL
                    ) AND COALESCE(config->"$.hasChartTab", TRUE) IS TRUE`);
                }
                else {
                    query = query.andWhere(`config->"$.type" = :type AND COALESCE(config->"$.hasChartTab", TRUE) IS TRUE`, { type: params.type });
                }
                tab = tab || GrapherConstants_1.GrapherTabOption.chart;
            }
        }
        if (params.logLinear) {
            query = query.andWhere(`config->'$.yAxis.canChangeScaleType' IS TRUE OR config->>'$.xAxis.canChangeScaleType' IS TRUE`);
            tab = GrapherConstants_1.GrapherTabOption.chart;
        }
        if (params.comparisonLines) {
            query = query.andWhere(`config->'$.comparisonLines[0].yEquals' != ''`);
            tab = GrapherConstants_1.GrapherTabOption.chart;
        }
        if (params.stackMode) {
            query = query.andWhere(`config->'$.stackMode' = :stackMode`, {
                stackMode: params.stackMode,
            });
            tab = GrapherConstants_1.GrapherTabOption.chart;
        }
        if (params.relativeToggle) {
            query = query.andWhere(`config->'$.hideRelativeToggle' IS FALSE`);
            tab = GrapherConstants_1.GrapherTabOption.chart;
        }
        if (params.categoricalLegend) {
            // This is more of a heuristic, since this query can potentially include charts that don't
            // have a visible categorial legend, and can leave out some that have one.
            // But in practice it seems to work reasonably well.
            query = query.andWhere(`json_length(config->'$.map.colorScale.customCategoryColors') > 1`);
            tab = GrapherConstants_1.GrapherTabOption.map;
        }
        if (params.mixedTimeTypes) {
            query = query.andWhere(`
            (
                SELECT COUNT(DISTINCT CASE
                    WHEN variables.display->"$.yearIsDay" IS NULL
                    THEN "year"
                    ELSE "day"
                END) as timeTypeCount
                FROM variables
                JOIN chart_dimensions ON chart_dimensions.variableId = variables.id
                WHERE chart_dimensions.chartId = charts.id
            ) >= 2
        `);
        }
        if (params.addCountryMode) {
            const mode = params.addCountryMode;
            if (mode === GrapherConstants_1.EntitySelectionMode.MultipleEntities) {
                query = query.andWhere(`config->'$.addCountryMode' IS NULL OR config->'$.addCountryMode' = :mode`, {
                    mode: GrapherConstants_1.EntitySelectionMode.MultipleEntities,
                });
            }
            else {
                query = query.andWhere(`config->'$.addCountryMode' = :mode`, {
                    mode,
                });
            }
        }
        if (ids.length > 0) {
            query = query.andWhere(`charts.id IN (${params.ids})`);
        }
        if (tab === GrapherConstants_1.GrapherTabOption.map) {
            query = query.andWhere(`config->"$.hasMapTab" IS TRUE`);
        }
        else if (tab === GrapherConstants_1.GrapherTabOption.chart) {
            query = query.andWhere(`COALESCE(config->"$.hasChartTab", TRUE) IS TRUE`);
        }
        // Exclude charts that have the "Private" tag assigned, unless `includePrivate` is passed.
        // The data for these charts is not included in the public database dump used to populate
        // staging and local, so they are not comparable.
        if (params.includePrivate === undefined) {
            query.andWhere(`
            NOT EXISTS(
                SELECT *
                FROM tags
                JOIN chart_tags ON chart_tags.tagId = tags.id
                WHERE chart_tags.chartId = charts.id
                AND tags.name = 'Private'
            )
        `);
        }
        if (datasetIds.length > 0) {
            const datasetIds = params.datasetIds;
            query.andWhere(`
            EXISTS(
                SELECT *
                FROM variables
                INNER JOIN chart_dimensions ON chart_dimensions.variableId = variables.id
                WHERE variables.datasetId IN (:datasetIds)
                AND chart_dimensions.chartId = charts.id
            )
        `, { datasetIds });
        }
        if (namespaces.length > 0) {
            query.andWhere(`
            EXISTS(
                SELECT *
                FROM datasets
                INNER JOIN variables ON variables.datasetId = datasets.id
                INNER JOIN chart_dimensions ON chart_dimensions.variableId = variables.id
                WHERE datasets.namespace IN (:namespaces)
                AND chart_dimensions.chartId = charts.id
            )
        `, { namespaces: namespaces });
        }
        const charts = (yield query.getMany()).map((c) => ({
            id: c.id,
            slug: c.config.slug,
        }));
        if (tab) {
            charts.forEach((c) => (c.slug += `?tab=${tab}`));
        }
        const count = yield query.getCount();
        const numPages = Math.ceil(count / perPage);
        const originalUrl = Url_1.Url.fromURL(params.originalUrl);
        const prevPageUrl = page > 1
            ? originalUrl.updateQueryParams({ page: (page - 1).toString() })
                .fullUrl
            : undefined;
        const nextPageUrl = page < numPages
            ? originalUrl.updateQueryParams({ page: (page + 1).toString() })
                .fullUrl
            : undefined;
        return {
            prevPageUrl: prevPageUrl,
            nextPageUrl: nextPageUrl,
            charts: charts,
            currentPage: page,
            totalPages: numPages,
            comparisonUrl: (_c = params.comparisonUrl) !== null && _c !== void 0 ? _c : "https://ourworldindata.org",
        };
    });
}
function EmbedTestPage(props) {
    const style = `
        html, body {
            height: 100%;
            margin: 0;
            background-color: #f1f1f1;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        figure, iframe {
            border: 0;
            flex: 1;
            height: 450px;
            margin: 10px;
        }

        figure {
            padding-top: 3px;
        }

        .row {
            padding: 10px;
            margin: 0;
            border-bottom: 1px solid #ddd;
        }

        .side-by-side {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        h3 {
            width: 50%;
            text-align: center;
            margin: 0;
        }

        nav.pagination {
            width: 100%;
            text-align: center;
            padding: 15px;
        }

        .chart-id {
            font-size: 18px;
            font-weight: bold;
            padding-top: 10px;
            text-align: center;
        }

        .chart-id a {
            text-decoration: underline;
            text-decoration-color: #ccc;
        }
    `;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: "", pageTitle: "Test Embeds", baseUrl: serverSettings_1.BAKED_BASE_URL },
            React.createElement("style", { dangerouslySetInnerHTML: { __html: style } })),
        React.createElement("body", null,
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "side-by-side" },
                    React.createElement("h3", null, props.comparisonUrl),
                    !IS_LIVE && React.createElement("h3", null, serverSettings_1.BAKED_BASE_URL))),
            props.charts.map((chart) => (React.createElement("div", { key: chart.slug, className: "row" },
                React.createElement("div", { className: "chart-id" },
                    React.createElement("a", { href: UrlUtils_1.queryParamsToStr({
                            ids: chart.id.toString(),
                            comparisonUrl: props.comparisonUrl,
                        }) }, chart.id)),
                React.createElement("div", { className: "side-by-side" },
                    React.createElement("iframe", { src: `${props.comparisonUrl}/grapher/${chart.slug}`, loading: "lazy" }),
                    !IS_LIVE && (React.createElement("figure", { "data-grapher-src": `${serverSettings_1.BAKED_GRAPHER_URL}/${chart.slug}` })))))),
            React.createElement("nav", { className: "pagination" },
                props.prevPageUrl && (React.createElement("a", { href: props.prevPageUrl }, "<< Prev")),
                " ",
                props.currentPage !== undefined &&
                    props.totalPages !== undefined &&
                    `Page ${props.currentPage} of ${props.totalPages}`,
                " ",
                props.nextPageUrl && (React.createElement("a", { href: props.nextPageUrl }, "Next >>"))),
            React.createElement("script", { src: `${serverSettings_1.BAKED_GRAPHER_URL}/embedCharts.js` }))));
}
testPageRouter.get("/embeds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const props = yield propsFromQueryParams(Object.assign(Object.assign({}, req.query), { originalUrl: req.originalUrl }));
    res.send(serverUtil_1.renderToHtmlPage(React.createElement(EmbedTestPage, Object.assign({}, props))));
}));
testPageRouter.get("/embeds/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const chart = yield Chart_1.Chart.createQueryBuilder()
        .where("id = :id", { id: id })
        .getOne();
    if (chart) {
        const charts = [
            {
                id: chart.id,
                slug: `${chart.config.slug}${req.query.tab ? `?tab=${req.query.tab}` : ""}`,
            },
        ];
        res.send(serverUtil_1.renderToHtmlPage(React.createElement(EmbedTestPage, { charts: charts, comparisonUrl: DEFAULT_COMPARISON_URL })));
    }
    else {
        res.send("Could not find chart ID");
    }
}));
function PreviewTestPage(props) {
    const style = `
        html, body {
            height: 100%;
            margin: 0;
        }

        img {
            width: 45%;
        }

        nav.pagination {
            width: 100%;
            text-align: center;
        }
    `;
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            React.createElement("title", null, "Test Previews"),
            React.createElement("style", { dangerouslySetInnerHTML: { __html: style } })),
        React.createElement("body", null, props.charts.map((chart) => (React.createElement("div", { key: chart.slug, className: "row" },
            React.createElement("a", { href: `https://ourworldindata.org/grapher/${chart.slug}` },
                React.createElement("img", { src: `https://ourworldindata.org/grapher/exports/${chart.slug}.svg` })),
            React.createElement("a", { href: `/grapher/${chart.slug}` },
                React.createElement("img", { src: `/grapher/exports/${chart.slug}.svg` }))))))));
}
function EmbedVariantsTestPage(props) {
    const style = `
        html, body {
            height: 100%;
            margin: 0;
            background-color: #f1f1f1;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        figure, iframe {
            border: 0;
            flex: 1;
            height: 450px;
            margin: 10px;
        }

        .row {
            padding: 10px;
            margin: 0;
            border-bottom: 1px solid #ddd;
        }

        .side-by-side {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        h3 {
            width: 50%;
            text-align: center;
            margin: 0;
        }

        nav.pagination {
            width: 100%;
            text-align: center;
            padding: 15px;
        }

        .chart-id {
            font-size: 18px;
            font-weight: bold;
            padding-top: 10px;
            text-align: center;
        }
    `;
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
            React.createElement("title", null, "Test Embed Variants"),
            React.createElement("style", { dangerouslySetInnerHTML: { __html: style } })),
        React.createElement("body", null,
            props.charts.map((chart) => (React.createElement("div", { key: chart.slug, className: "row" },
                React.createElement("div", { className: "chart-id" }, chart.id),
                React.createElement("div", { className: "side-by-side" },
                    React.createElement("iframe", { src: `${serverSettings_1.BAKED_GRAPHER_URL}/${chart.slug}` }),
                    !IS_LIVE && (React.createElement("figure", { "data-grapher-src": `${serverSettings_1.BAKED_GRAPHER_URL}/${chart.slug}` })))))),
            React.createElement("nav", { className: "pagination" },
                props.prevPageUrl && (React.createElement("a", { href: props.prevPageUrl }, "<< Prev")),
                " ",
                props.currentPage !== undefined &&
                    props.totalPages !== undefined &&
                    `Page ${props.currentPage} of ${props.totalPages}`,
                " ",
                props.nextPageUrl && (React.createElement("a", { href: props.nextPageUrl }, "Next >>"))),
            React.createElement("script", { src: `${serverSettings_1.BAKED_GRAPHER_URL}/embedCharts.js` }))));
}
testPageRouter.get("/previews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db.queryMysql(`SELECT config FROM charts LIMIT 200`);
    const charts = rows.map((row) => JSON.parse(row.config));
    res.send(serverUtil_1.renderToHtmlPage(React.createElement(PreviewTestPage, { charts: charts })));
}));
testPageRouter.get("/embedVariants", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db.queryMysql(`SELECT config FROM charts WHERE id=64`);
    const charts = rows.map((row) => JSON.parse(row.config));
    res.send(serverUtil_1.renderToHtmlPage(React.createElement(EmbedVariantsTestPage, { charts: charts })));
}));
testPageRouter.get("/:slug.svg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grapher = yield Chart_1.OldChart.getBySlug(req.params.slug);
    const vardata = yield grapher.getVariableData();
    res.send(yield GrapherImageBaker_1.grapherToSVG(grapher.config, vardata));
}));
//# sourceMappingURL=testPageRouter.js.map