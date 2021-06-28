"use strict";
/* eslint @typescript-eslint/no-unused-vars: [ "warn", { argsIgnorePattern: "^(res|req)$" } ] */
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
exports.apiRouter = void 0;
const lodash = __importStar(require("lodash"));
const typeorm_1 = require("typeorm");
const bodyParser = __importStar(require("body-parser"));
const db = __importStar(require("../db/db"));
const wpdb = __importStar(require("../db/wpdb"));
const serverSettings_1 = require("../settings/serverSettings");
const serverUtil_1 = require("./serverUtil");
const mail_1 = require("./mail");
const Chart_1 = require("../db/model/Chart");
const UserInvitation_1 = require("../db/model/UserInvitation");
const Variable_1 = require("../db/model/Variable");
const CountryNameFormat_1 = require("../adminSiteClient/CountryNameFormat");
const Dataset_1 = require("../db/model/Dataset");
const User_1 = require("../db/model/User");
const gitDataExport_1 = require("./gitDataExport");
const ChartRevision_1 = require("../db/model/ChartRevision");
const Post_1 = require("../db/model/Post");
const string_1 = require("../clientUtils/string");
const slackLog_1 = require("../baker/slackLog");
const countryProfiles_1 = require("../baker/countryProfiles");
const serverSettings_2 = require("../settings/serverSettings");
const DeployQueueServer_1 = require("../baker/DeployQueueServer");
const FunctionalRouter_1 = require("./FunctionalRouter");
const owidTypes_1 = require("../clientUtils/owidTypes");
const apiRouter = new FunctionalRouter_1.FunctionalRouter();
exports.apiRouter = apiRouter;
// Call this to trigger build and deployment of static charts on change
const triggerStaticBuild = (user, commitMessage) => __awaiter(void 0, void 0, void 0, function* () {
    if (!serverSettings_1.BAKE_ON_CHANGE) {
        console.log("Not triggering static build because BAKE_ON_CHANGE is false");
        return;
    }
    new DeployQueueServer_1.DeployQueueServer().enqueueChange({
        timeISOString: new Date().toISOString(),
        authorName: user.fullName,
        authorEmail: user.email,
        message: commitMessage,
    });
});
function getLogsByChartId(chartId) {
    return __awaiter(this, void 0, void 0, function* () {
        const logs = yield db.queryMysql(`SELECT userId, config, fullName as userName, l.createdAt
        FROM chart_revisions l
        LEFT JOIN users u on u.id = userId
        WHERE chartId = ?
        ORDER BY l.id DESC
        LIMIT 50`, [chartId]);
        return logs;
    });
}
const getReferencesByChartId = (chartId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!wpdb.isWordpressDBEnabled)
        return [];
    const rows = yield db.queryMysql(`
        SELECT config->"$.slug" AS slug
        FROM charts
        WHERE id = ?
        UNION
        SELECT slug AS slug
        FROM chart_slug_redirects
        WHERE chart_id = ?
    `, [chartId, chartId]);
    const slugs = rows.map((row) => row.slug && row.slug.replace(/^"|"$/g, ""));
    if (!slugs || slugs.length === 0)
        return [];
    let posts = [];
    // Hacky approach to find all the references to a chart by searching for
    // the chart URL through the Wordpress database.
    // The Grapher should work without the Wordpress database, so we need to
    // handle failures gracefully.
    // NOTE: Sometimes slugs can be substrings of other slugs, e.g.
    // `grapher/gdp` is a substring of `grapher/gdp-maddison`. We need to be
    // careful not to erroneously match those, which is why we switched to a
    // REGEXP.
    try {
        posts = yield wpdb.singleton.query(`
                SELECT ID, post_title, post_name
                FROM wp_posts
                WHERE
                    (post_type='page' OR post_type='post' OR post_type='wp_block')
                    AND post_status='publish'
                    AND (
                        ${slugs
            .map(() => `post_content REGEXP CONCAT('grapher/', ?, '[^a-zA-Z_\-]')`)
            .join(" OR ")}
                    )
            `, slugs.map(lodash.escapeRegExp));
    }
    catch (error) {
        console.warn(`Error in getReferencesByChartId`);
        console.error(error);
        // We can ignore errors due to not being able to connect.
    }
    const permalinks = yield wpdb.getPermalinks();
    return posts.map((post) => {
        const slug = permalinks.get(post.ID, post.post_name);
        return {
            id: post.ID,
            title: post.post_title,
            slug: slug,
            url: `${serverSettings_2.BAKED_BASE_URL}/${slug}`,
        };
    });
});
const getRedirectsByChartId = (chartId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db.queryMysql(`
        SELECT id, slug, chart_id as chartId
        FROM chart_slug_redirects
        WHERE chart_id = ?
        ORDER BY id ASC`, [chartId]);
});
const expectChartById = (chartId) => __awaiter(void 0, void 0, void 0, function* () {
    const chart = yield Chart_1.getGrapherById(serverUtil_1.expectInt(chartId));
    if (chart)
        return chart;
    throw new owidTypes_1.JsonError(`No chart found for id ${chartId}`, 404);
});
const saveGrapher = (user, newConfig, existingConfig) => __awaiter(void 0, void 0, void 0, function* () {
    return db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        // Slugs need some special logic to ensure public urls remain consistent whenever possible
        function isSlugUsedInRedirect() {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = yield t.query(`SELECT * FROM chart_slug_redirects WHERE chart_id != ? AND slug = ?`, [existingConfig ? existingConfig.id : undefined, newConfig.slug]);
                return rows.length > 0;
            });
        }
        function isSlugUsedInOtherGrapher() {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = yield t.query(`SELECT * FROM charts WHERE id != ? AND JSON_EXTRACT(config, "$.isPublished") IS TRUE AND JSON_EXTRACT(config, "$.slug") = ?`, [existingConfig ? existingConfig.id : undefined, newConfig.slug]);
                return rows.length > 0;
            });
        }
        // When a chart is published, check for conflicts
        if (newConfig.isPublished) {
            if (!serverUtil_1.isValidSlug(newConfig.slug))
                throw new owidTypes_1.JsonError(`Invalid chart slug ${newConfig.slug}`);
            else if (yield isSlugUsedInRedirect())
                throw new owidTypes_1.JsonError(`This chart slug was previously used by another chart: ${newConfig.slug}`);
            else if (yield isSlugUsedInOtherGrapher())
                throw new owidTypes_1.JsonError(`This chart slug is in use by another published chart: ${newConfig.slug}`);
            else if (existingConfig &&
                existingConfig.isPublished &&
                existingConfig.slug !== newConfig.slug) {
                // Changing slug of an existing chart, delete any old redirect and create new one
                yield t.execute(`DELETE FROM chart_slug_redirects WHERE chart_id = ? AND slug = ?`, [existingConfig.id, existingConfig.slug]);
                yield t.execute(`INSERT INTO chart_slug_redirects (chart_id, slug) VALUES (?, ?)`, [existingConfig.id, existingConfig.slug]);
            }
        }
        if (existingConfig)
            // Bump chart version, very important for cachebusting
            newConfig.version = existingConfig.version + 1;
        else if (newConfig.version)
            // If a chart is republished, we want to keep incrementing the old version number,
            // otherwise it can lead to clients receiving cached versions of the old data.
            newConfig.version += 1;
        else
            newConfig.version = 1;
        // Execute the actual database update or creation
        const now = new Date();
        let chartId = existingConfig && existingConfig.id;
        const newJsonConfig = JSON.stringify(newConfig);
        // todo: drop "isExplorable"
        if (existingConfig)
            yield t.query(`UPDATE charts SET config=?, updatedAt=?, lastEditedAt=?, lastEditedByUserId=?, isExplorable=? WHERE id = ?`, [newJsonConfig, now, now, user.id, false, chartId]);
        else {
            const result = yield t.execute(`INSERT INTO charts (config, createdAt, updatedAt, lastEditedAt, lastEditedByUserId, starred, isExplorable) VALUES (?)`, [[newJsonConfig, now, now, now, user.id, false, false]]);
            chartId = result.insertId;
        }
        // Record this change in version history
        const log = new ChartRevision_1.ChartRevision();
        log.chartId = chartId;
        log.userId = user.id;
        log.config = newConfig;
        // TODO: the orm needs to support this but it does not :(
        log.createdAt = new Date();
        log.updatedAt = new Date();
        yield t.manager.save(log);
        // Remove any old dimensions and store the new ones
        // We only note that a relationship exists between the chart and variable in the database; the actual dimension configuration is left to the json
        yield t.execute(`DELETE FROM chart_dimensions WHERE chartId=?`, [
            chartId,
        ]);
        for (let i = 0; i < newConfig.dimensions.length; i++) {
            const dim = newConfig.dimensions[i];
            yield t.execute(`INSERT INTO chart_dimensions (chartId, variableId, property, \`order\`) VALUES (?)`, [[chartId, dim.variableId, dim.property, i]]);
        }
        // So we can generate country profiles including this chart data
        if (newConfig.isPublished)
            yield countryProfiles_1.denormalizeLatestCountryData(newConfig.dimensions.map((d) => d.variableId));
        if (newConfig.isPublished &&
            (!existingConfig || !existingConfig.isPublished)) {
            // Newly published, set publication info
            yield t.execute(`UPDATE charts SET publishedAt=?, publishedByUserId=? WHERE id = ? `, [now, user.id, chartId]);
            yield triggerStaticBuild(user, `Publishing chart ${newConfig.slug}`);
        }
        else if (!newConfig.isPublished &&
            existingConfig &&
            existingConfig.isPublished) {
            // Unpublishing chart, delete any existing redirects to it
            yield t.execute(`DELETE FROM chart_slug_redirects WHERE chart_id = ?`, [existingConfig.id]);
            yield triggerStaticBuild(user, `Unpublishing chart ${newConfig.slug}`);
        }
        else if (newConfig.isPublished)
            yield triggerStaticBuild(user, `Updating chart ${newConfig.slug}`);
        return chartId;
    }));
});
apiRouter.get("/charts.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 10000;
    const charts = yield db.queryMysql(`
        SELECT ${Chart_1.OldChart.listFields} FROM charts
        JOIN users lastEditedByUser ON lastEditedByUser.id = charts.lastEditedByUserId
        LEFT JOIN users publishedByUser ON publishedByUser.id = charts.publishedByUserId
        ORDER BY charts.lastEditedAt DESC LIMIT ?
    `, [limit]);
    yield Chart_1.Chart.assignTagsForCharts(charts);
    return { charts };
}));
apiRouter.get("/charts/:chartId.config.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return expectChartById(req.params.chartId); }));
apiRouter.get("/editorData/namespaces.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = (yield db.queryMysql(`SELECT DISTINCT
                namespace AS name,
                namespaces.description AS description,
                namespaces.isArchived AS isArchived
            FROM datasets
            JOIN namespaces ON namespaces.name = datasets.namespace`));
    return {
        namespaces: lodash
            .sortBy(rows, (row) => row.description)
            .map((namespace) => (Object.assign(Object.assign({}, namespace), { isArchived: !!namespace.isArchived }))),
    };
}));
apiRouter.get("/charts/:chartId.logs.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        logs: yield getLogsByChartId(req.params.chartId),
    });
}));
apiRouter.get("/charts/:chartId.references.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        references: yield getReferencesByChartId(req.params.chartId),
    });
}));
apiRouter.get("/charts/:chartId.redirects.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        redirects: yield getRedirectsByChartId(req.params.chartId),
    });
}));
apiRouter.get("/countries.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rows = [];
    const input = req.query.input;
    const output = req.query.output;
    if (input === CountryNameFormat_1.CountryNameFormat.NonStandardCountryName) {
        const outputColumn = CountryNameFormat_1.CountryDefByKey[output].column_name;
        rows = yield db.queryMysql(`
            SELECT country_name as input, ${outputColumn} as output
            FROM country_name_tool_countryname ccn
            LEFT JOIN country_name_tool_countrydata ccd on ccn.owid_country = ccd.id
            LEFT JOIN country_name_tool_continent con on con.id = ccd.continent`);
    }
    else {
        const inputColumn = CountryNameFormat_1.CountryDefByKey[input].column_name;
        const outputColumn = CountryNameFormat_1.CountryDefByKey[output].column_name;
        rows = yield db.queryMysql(`SELECT ${inputColumn} as input, ${outputColumn} as output
            FROM country_name_tool_countrydata ccd
            LEFT JOIN country_name_tool_continent con on con.id = ccd.continent`);
    }
    return {
        countries: rows,
    };
}));
apiRouter.post("/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const countries = req.body.countries;
    const mapOwidNameToId = {};
    let owidRows = [];
    // find owid ID
    const owidNames = Object.keys(countries).map((key) => countries[key]);
    owidRows = yield db.queryMysql(`SELECT id, owid_name
        FROM country_name_tool_countrydata
        WHERE owid_name in (?)
        `, [owidNames]);
    for (const row of owidRows) {
        mapOwidNameToId[row.owid_name] = row.id;
    }
    // insert one by one (ideally do a bulk insert)
    for (const country of Object.keys(countries)) {
        const owidName = countries[country];
        console.log(`adding ${country}, ${mapOwidNameToId[owidName]}, ${owidName}`);
        yield db.execute(`INSERT INTO country_name_tool_countryname (country_name, owid_country)
            VALUES (?, ?)`, [country, mapOwidNameToId[owidName]]);
    }
    return { success: true };
}));
apiRouter.get("/editorData/:namespace.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datasets = [];
    const rows = yield db.queryMysql(`SELECT v.name, v.id, d.name as datasetName, d.namespace, d.isPrivate
         FROM variables as v JOIN datasets as d ON v.datasetId = d.id
         WHERE namespace=? ORDER BY d.updatedAt DESC`, [req.params.namespace]);
    let dataset;
    for (const row of rows) {
        if (!dataset || row.datasetName !== dataset.name) {
            if (dataset)
                datasets.push(dataset);
            dataset = {
                name: row.datasetName,
                namespace: row.namespace,
                isPrivate: row.isPrivate,
                variables: [],
            };
        }
        dataset.variables.push({
            id: row.id,
            name: row.name,
        });
    }
    if (dataset)
        datasets.push(dataset);
    return { datasets: datasets };
}));
apiRouter.get("/data/variables/:variableStr.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const variableIds = req.params.variableStr
        .split("+")
        .map((v) => parseInt(v));
    return Variable_1.getVariableData(variableIds);
}));
// Mark a chart for display on the front page
apiRouter.post("/charts/:chartId/star", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chart = yield expectChartById(req.params.chartId);
    yield db.execute(`UPDATE charts SET starred=(charts.id=?)`, [chart.id]);
    yield triggerStaticBuild(res.locals.user, `Setting front page chart to ${chart.slug}`);
    return { success: true };
}));
apiRouter.post("/charts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chartId = yield saveGrapher(res.locals.user, req.body);
    return { success: true, chartId: chartId };
}));
apiRouter.post("/charts/:chartId/setTags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chartId = serverUtil_1.expectInt(req.params.chartId);
    yield Chart_1.Chart.setTags(chartId, req.body.tagIds);
    return { success: true };
}));
apiRouter.put("/charts/:chartId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingConfig = yield expectChartById(req.params.chartId);
    yield saveGrapher(res.locals.user, req.body, existingConfig);
    const logs = yield getLogsByChartId(existingConfig.id);
    return { success: true, chartId: existingConfig.id, newLog: logs[0] };
}));
apiRouter.delete("/charts/:chartId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chart = yield expectChartById(req.params.chartId);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t.execute(`DELETE FROM chart_dimensions WHERE chartId=?`, [
            chart.id,
        ]);
        yield t.execute(`DELETE FROM chart_slug_redirects WHERE chart_id=?`, [
            chart.id,
        ]);
        yield t.execute(`DELETE FROM charts WHERE id=?`, [chart.id]);
    }));
    if (chart.isPublished)
        yield triggerStaticBuild(res.locals.user, `Deleting chart ${chart.slug}`);
    return { success: true };
}));
apiRouter.get("/users.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        users: yield User_1.User.find({
            select: [
                "id",
                "email",
                "fullName",
                "isActive",
                "isSuperuser",
                "createdAt",
                "updatedAt",
                "lastLogin",
                "lastSeen",
            ],
            order: { lastSeen: "DESC" },
        }),
    });
}));
apiRouter.get("/users/:userId.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        user: yield User_1.User.findOne(req.params.userId, {
            select: [
                "id",
                "email",
                "fullName",
                "isActive",
                "isSuperuser",
                "createdAt",
                "updatedAt",
                "lastLogin",
                "lastSeen",
            ],
        }),
    });
}));
apiRouter.delete("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res.locals.user.isSuperuser)
        throw new owidTypes_1.JsonError("Permission denied", 403);
    const userId = serverUtil_1.expectInt(req.params.userId);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t.execute(`DELETE FROM users WHERE id=?`, [userId]);
    }));
    return { success: true };
}));
apiRouter.put("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res.locals.user.isSuperuser)
        throw new owidTypes_1.JsonError("Permission denied", 403);
    const user = yield User_1.User.findOne(req.params.userId);
    if (!user)
        throw new owidTypes_1.JsonError("No such user", 404);
    user.fullName = req.body.fullName;
    user.isActive = req.body.isActive;
    yield user.save();
    return { success: true };
}));
apiRouter.post("/users/invite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!res.locals.user.isSuperuser)
        throw new owidTypes_1.JsonError("Permission denied", 403);
    const { email } = req.body;
    yield typeorm_1.getConnection().transaction((manager) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove any previous invites for this email address to avoid duplicate accounts
        const repo = manager.getRepository(UserInvitation_1.UserInvitation);
        yield repo
            .createQueryBuilder()
            .where(`email = :email`, { email })
            .delete()
            .execute();
        const invite = new UserInvitation_1.UserInvitation();
        invite.email = email;
        invite.code = UserInvitation_1.UserInvitation.makeInviteCode();
        invite.validTill = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        invite.createdAt = new Date();
        invite.updatedAt = new Date();
        yield repo.save(invite);
        const inviteLink = serverUtil_1.absoluteUrl(`/admin/register?code=${invite.code}`);
        yield mail_1.sendMail({
            from: "no-reply@ourworldindata.org",
            to: email,
            subject: "Invitation to join owid-admin",
            text: `Hi, please follow this link to register on owid-admin: ${inviteLink}`,
        });
    }));
    return { success: true };
}));
apiRouter.get("/variables.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 50;
    const searchStr = req.query.search;
    const query = `
        SELECT v.id, v.name, d.id AS datasetId, d.name AS datasetName, d.isPrivate AS isPrivate, d.dataEditedAt AS uploadedAt, u.fullName AS uploadedBy
        FROM variables AS v
        JOIN datasets d ON d.id=v.datasetId
        JOIN users u ON u.id=d.dataEditedByUserId
        ${searchStr ? "WHERE v.name LIKE ?" : ""}
        ORDER BY d.dataEditedAt DESC
        LIMIT ?
    `;
    const rows = yield db.queryMysql(query, searchStr ? [`%${searchStr}%`, limit] : [limit]);
    const numTotalRows = (yield db.queryMysql(`SELECT COUNT(*) as count FROM variables`))[0].count;
    return { variables: rows, numTotalRows: numTotalRows };
}));
apiRouter.get("/variables/:variableId.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const variableId = serverUtil_1.expectInt(req.params.variableId);
    const variable = yield db.mysqlFirst(`
        SELECT v.id, v.name, v.unit, v.shortUnit, v.description, v.sourceId, u.fullName AS uploadedBy,
               v.display, d.id AS datasetId, d.name AS datasetName, d.namespace AS datasetNamespace
        FROM variables v
        JOIN datasets d ON d.id=v.datasetId
        JOIN users u ON u.id=d.dataEditedByUserId
        WHERE v.id = ?
    `, [variableId]);
    if (!variable) {
        throw new owidTypes_1.JsonError(`No variable by id '${variableId}'`, 404);
    }
    variable.display = JSON.parse(variable.display);
    variable.source = yield db.mysqlFirst(`SELECT id, name FROM sources AS s WHERE id = ?`, variable.sourceId);
    const charts = yield db.queryMysql(`
        SELECT ${Chart_1.OldChart.listFields}
        FROM charts
        JOIN users lastEditedByUser ON lastEditedByUser.id = charts.lastEditedByUserId
        LEFT JOIN users publishedByUser ON publishedByUser.id = charts.publishedByUserId
        JOIN chart_dimensions cd ON cd.chartId = charts.id
        WHERE cd.variableId = ?
        GROUP BY charts.id
    `, [variableId]);
    yield Chart_1.Chart.assignTagsForCharts(charts);
    variable.charts = charts;
    return {
        variable: variable,
    }; /*, vardata: await getVariableData([variableId]) }*/
}));
apiRouter.put("/variables/:variableId", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const variableId = serverUtil_1.expectInt(req.params.variableId);
    const variable = req.body.variable;
    yield db.execute(`UPDATE variables SET name=?, description=?, updatedAt=?, display=? WHERE id = ?`, [
        variable.name,
        variable.description,
        new Date(),
        JSON.stringify(variable.display),
        variableId,
    ]);
    return { success: true };
}));
apiRouter.delete("/variables/:variableId", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const variableId = serverUtil_1.expectInt(req.params.variableId);
    const variable = yield db.mysqlFirst(`SELECT datasets.namespace FROM variables JOIN datasets ON variables.datasetId=datasets.id WHERE variables.id=?`, [variableId]);
    if (!variable)
        throw new owidTypes_1.JsonError(`No variable by id ${variableId}`, 404);
    else if (variable.namespace !== "owid")
        throw new owidTypes_1.JsonError(`Cannot delete bulk import variable`, 400);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t.execute(`DELETE FROM data_values WHERE variableId=?`, [
            variableId,
        ]);
        yield t.execute(`DELETE FROM variables WHERE id=?`, [variableId]);
    }));
    return { success: true };
}));
apiRouter.get("/datasets.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const datasets = yield db.queryMysql(`
        SELECT d.id, d.namespace, d.name, d.description, d.dataEditedAt, du.fullName AS dataEditedByUserName, d.metadataEditedAt, mu.fullName AS metadataEditedByUserName, d.isPrivate
        FROM datasets d
        JOIN users du ON du.id=d.dataEditedByUserId
        JOIN users mu ON mu.id=d.metadataEditedByUserId
        ORDER BY d.dataEditedAt DESC
    `);
    const tags = yield db.queryMysql(`
        SELECT dt.datasetId, t.id, t.name FROM dataset_tags dt
        JOIN tags t ON dt.tagId = t.id
    `);
    const tagsByDatasetId = lodash.groupBy(tags, (t) => t.datasetId);
    for (const dataset of datasets) {
        dataset.tags = (tagsByDatasetId[dataset.id] || []).map((t) => lodash.omit(t, "datasetId"));
    }
    /*LEFT JOIN variables AS v ON v.datasetId=d.id
    GROUP BY d.id*/
    return { datasets: datasets };
}));
apiRouter.get("/datasets/:datasetId.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    const dataset = yield db.mysqlFirst(`
        SELECT d.id, d.namespace, d.name, d.description, d.updatedAt, d.isPrivate, d.dataEditedAt, d.dataEditedByUserId, du.fullName AS dataEditedByUserName, d.metadataEditedAt, d.metadataEditedByUserId, mu.fullName AS metadataEditedByUserName, d.isPrivate
        FROM datasets AS d
        JOIN users du ON du.id=d.dataEditedByUserId
        JOIN users mu ON mu.id=d.metadataEditedByUserId
        WHERE d.id = ?
    `, [datasetId]);
    if (!dataset)
        throw new owidTypes_1.JsonError(`No dataset by id '${datasetId}'`, 404);
    const zipFile = yield db.mysqlFirst(`SELECT filename FROM dataset_files WHERE datasetId=?`, [datasetId]);
    if (zipFile)
        dataset.zipFile = zipFile;
    const variables = yield db.queryMysql(`
        SELECT v.id, v.name, v.description, v.display
        FROM variables AS v
        WHERE v.datasetId = ?
    `, [datasetId]);
    for (const v of variables) {
        v.display = JSON.parse(v.display);
    }
    dataset.variables = variables;
    // Currently for backwards compatibility datasets can still have multiple sources
    // but the UI presents only a single item of source metadata, we use the first source
    const sources = yield db.queryMysql(`
        SELECT s.id, s.name, s.description
        FROM sources AS s
        WHERE s.datasetId = ?
        ORDER BY s.id ASC
    `, [datasetId]);
    dataset.source = JSON.parse(sources[0].description);
    dataset.source.id = sources[0].id;
    dataset.source.name = sources[0].name;
    const charts = yield db.queryMysql(`
        SELECT ${Chart_1.OldChart.listFields}
        FROM charts
        JOIN chart_dimensions AS cd ON cd.chartId = charts.id
        JOIN variables AS v ON cd.variableId = v.id
        JOIN users lastEditedByUser ON lastEditedByUser.id = charts.lastEditedByUserId
        LEFT JOIN users publishedByUser ON publishedByUser.id = charts.publishedByUserId
        WHERE v.datasetId = ?
        GROUP BY charts.id
    `, [datasetId]);
    dataset.charts = charts;
    yield Chart_1.Chart.assignTagsForCharts(charts);
    const tags = yield db.queryMysql(`
        SELECT t.id, t.name
        FROM tags t
        JOIN dataset_tags dt ON dt.tagId = t.id
        WHERE dt.datasetId = ?
    `, [datasetId]);
    dataset.tags = tags;
    const availableTags = yield db.queryMysql(`
        SELECT t.id, t.name, p.name AS parentName
        FROM tags AS t
        JOIN tags AS p ON t.parentId=p.id
        WHERE p.isBulkImport IS FALSE
    `);
    dataset.availableTags = availableTags;
    return { dataset: dataset };
}));
apiRouter.put("/datasets/:datasetId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    const dataset = yield Dataset_1.Dataset.findOne({ id: datasetId });
    if (!dataset)
        throw new owidTypes_1.JsonError(`No dataset by id ${datasetId}`, 404);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const newDataset = req.body.dataset;
        yield t.execute(`UPDATE datasets SET name=?, description=?, isPrivate=?, metadataEditedAt=?, metadataEditedByUserId=? WHERE id=?`, [
            newDataset.name,
            newDataset.description || "",
            newDataset.isPrivate,
            new Date(),
            res.locals.user.id,
            datasetId,
        ]);
        const tagRows = newDataset.tags.map((tag) => [tag.id, datasetId]);
        yield t.execute(`DELETE FROM dataset_tags WHERE datasetId=?`, [
            datasetId,
        ]);
        if (tagRows.length)
            yield t.execute(`INSERT INTO dataset_tags (tagId, datasetId) VALUES ?`, [tagRows]);
        const source = newDataset.source;
        const description = lodash.omit(source, ["name", "id"]);
        yield t.execute(`UPDATE sources SET name=?, description=? WHERE id=?`, [
            source.name,
            JSON.stringify(description),
            source.id,
        ]);
    }));
    // Note: not currently in transaction
    try {
        yield gitDataExport_1.syncDatasetToGitRepo(datasetId, {
            oldDatasetName: dataset.name,
            commitName: res.locals.user.fullName,
            commitEmail: res.locals.user.email,
        });
    }
    catch (err) {
        slackLog_1.log.logErrorAndMaybeSendToSlack(err);
        // Continue
    }
    return { success: true };
}));
apiRouter.post("/datasets/:datasetId/setTags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    yield Dataset_1.Dataset.setTags(datasetId, req.body.tagIds);
    return { success: true };
}));
apiRouter.router.put("/datasets/:datasetId/uploadZip", bodyParser.raw({ type: "application/zip", limit: "50mb" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t.execute(`DELETE FROM dataset_files WHERE datasetId=?`, [
            datasetId,
        ]);
        yield t.execute(`INSERT INTO dataset_files (datasetId, filename, file) VALUES (?, ?, ?)`, [datasetId, "additional-material.zip", req.body]);
    }));
    res.send({ success: true });
}));
apiRouter.delete("/datasets/:datasetId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    const dataset = yield Dataset_1.Dataset.findOne({ id: datasetId });
    if (!dataset)
        throw new owidTypes_1.JsonError(`No dataset by id ${datasetId}`, 404);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t.execute(`DELETE d FROM data_values AS d JOIN variables AS v ON d.variableId=v.id WHERE v.datasetId=?`, [datasetId]);
        yield t.execute(`DELETE d FROM country_latest_data AS d JOIN variables AS v ON d.variable_id=v.id WHERE v.datasetId=?`, [datasetId]);
        yield t.execute(`DELETE FROM dataset_files WHERE datasetId=?`, [
            datasetId,
        ]);
        yield t.execute(`DELETE FROM variables WHERE datasetId=?`, [
            datasetId,
        ]);
        yield t.execute(`DELETE FROM sources WHERE datasetId=?`, [
            datasetId,
        ]);
        yield t.execute(`DELETE FROM datasets WHERE id=?`, [datasetId]);
    }));
    try {
        yield gitDataExport_1.removeDatasetFromGitRepo(dataset.name, dataset.namespace, {
            commitName: res.locals.user.fullName,
            commitEmail: res.locals.user.email,
        });
    }
    catch (err) {
        slackLog_1.log.logErrorAndMaybeSendToSlack(err);
        // Continue
    }
    return { success: true };
}));
apiRouter.post("/datasets/:datasetId/charts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    const dataset = yield Dataset_1.Dataset.findOne({ id: datasetId });
    if (!dataset)
        throw new owidTypes_1.JsonError(`No dataset by id ${datasetId}`, 404);
    if (req.body.republish) {
        yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            yield t.execute(`
            UPDATE charts
            SET config = JSON_SET(config, "$.version", config->"$.version" + 1)
            WHERE id IN (
                SELECT DISTINCT chart_dimensions.chartId
                FROM chart_dimensions
                JOIN variables ON variables.id = chart_dimensions.variableId
                WHERE variables.datasetId = ?
            )
            `, [datasetId]);
        }));
    }
    yield triggerStaticBuild(res.locals.user, `Republishing all charts in dataset ${dataset.name} (${dataset.id})`);
    return { success: true };
}));
// Get a list of redirects that map old slugs to charts
apiRouter.get("/redirects.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        redirects: yield db.queryMysql(`
        SELECT r.id, r.slug, r.chart_id as chartId, JSON_UNQUOTE(JSON_EXTRACT(charts.config, "$.slug")) AS chartSlug
        FROM chart_slug_redirects AS r JOIN charts ON charts.id = r.chart_id
        ORDER BY r.id DESC`),
    });
}));
apiRouter.get("/tags/:tagId.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = serverUtil_1.expectInt(req.params.tagId);
    // NOTE (Mispy): The "uncategorized" tag is special -- it represents all untagged stuff
    // Bit fiddly to handle here but more true to normalized schema than having to remember to add the special tag
    // every time we create a new chart etcs
    const uncategorized = tagId === serverSettings_1.UNCATEGORIZED_TAG_ID;
    const tag = yield db.mysqlFirst(`
        SELECT t.id, t.name, t.specialType, t.updatedAt, t.parentId, p.isBulkImport
        FROM tags t LEFT JOIN tags p ON t.parentId=p.id
        WHERE t.id = ?
    `, [tagId]);
    // Datasets tagged with this tag
    const datasets = yield db.queryMysql(`
        SELECT d.id, d.namespace, d.name, d.description, d.createdAt, d.updatedAt, d.dataEditedAt, du.fullName AS dataEditedByUserName, d.isPrivate
        FROM datasets d
        JOIN users du ON du.id=d.dataEditedByUserId
        LEFT JOIN dataset_tags dt ON dt.datasetId = d.id
        WHERE dt.tagId ${uncategorized ? "IS NULL" : "= ?"}
        ORDER BY d.dataEditedAt DESC
    `, uncategorized ? [] : [tagId]);
    tag.datasets = datasets;
    // The other tags for those datasets
    if (tag.datasets.length) {
        if (uncategorized) {
            for (const dataset of tag.datasets)
                dataset.tags = [];
        }
        else {
            const datasetTags = yield db.queryMysql(`
                SELECT dt.datasetId, t.id, t.name FROM dataset_tags dt
                JOIN tags t ON dt.tagId = t.id
                WHERE dt.datasetId IN (?)
            `, [tag.datasets.map((d) => d.id)]);
            const tagsByDatasetId = lodash.groupBy(datasetTags, (t) => t.datasetId);
            for (const dataset of tag.datasets) {
                dataset.tags = tagsByDatasetId[dataset.id].map((t) => lodash.omit(t, "datasetId"));
            }
        }
    }
    // Charts using datasets under this tag
    const charts = yield db.queryMysql(`
        SELECT ${Chart_1.OldChart.listFields} FROM charts
        LEFT JOIN chart_tags ct ON ct.chartId=charts.id
        JOIN users lastEditedByUser ON lastEditedByUser.id = charts.lastEditedByUserId
        LEFT JOIN users publishedByUser ON publishedByUser.id = charts.publishedByUserId
        WHERE ct.tagId ${tagId === serverSettings_1.UNCATEGORIZED_TAG_ID ? "IS NULL" : "= ?"}
        GROUP BY charts.id
        ORDER BY charts.updatedAt DESC
    `, uncategorized ? [] : [tagId]);
    tag.charts = charts;
    yield Chart_1.Chart.assignTagsForCharts(charts);
    // Subcategories
    const children = yield db.queryMysql(`
        SELECT t.id, t.name FROM tags t
        WHERE t.parentId = ?
    `, [tag.id]);
    tag.children = children;
    // Possible parents to choose from
    const possibleParents = yield db.queryMysql(`
        SELECT t.id, t.name FROM tags t
        WHERE t.parentId IS NULL AND t.isBulkImport IS FALSE
    `);
    tag.possibleParents = possibleParents;
    return {
        tag,
    };
}));
apiRouter.put("/tags/:tagId", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = serverUtil_1.expectInt(req.params.tagId);
    const tag = req.body.tag;
    yield db.execute(`UPDATE tags SET name=?, updatedAt=?, parentId=? WHERE id=?`, [tag.name, new Date(), tag.parentId, tagId]);
    return { success: true };
}));
apiRouter.post("/tags/new", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = req.body.tag;
    const now = new Date();
    const result = yield db.execute(`INSERT INTO tags (parentId, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)`, [tag.parentId, tag.name, now, now]);
    return { success: true, tagId: result.insertId };
}));
apiRouter.get("/tags.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield db.queryMysql(`
        SELECT t.id, t.name, t.parentId, t.specialType
        FROM tags t LEFT JOIN tags p ON t.parentId=p.id
        WHERE t.isBulkImport IS FALSE AND (t.parentId IS NULL OR p.isBulkImport IS FALSE)
        ORDER BY t.name ASC
    `);
    return {
        tags,
    };
}));
apiRouter.delete("/tags/:tagId/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tagId = serverUtil_1.expectInt(req.params.tagId);
    yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield t.execute(`DELETE FROM tags WHERE id=?`, [tagId]);
    }));
    return { success: true };
}));
apiRouter.post("/charts/:chartId/redirects/new", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const chartId = serverUtil_1.expectInt(req.params.chartId);
    const fields = req.body;
    const result = yield db.execute(`INSERT INTO chart_slug_redirects (chart_id, slug) VALUES (?, ?)`, [chartId, fields.slug]);
    const redirectId = result.insertId;
    const redirect = yield db.mysqlFirst(`SELECT * FROM chart_slug_redirects WHERE id = ?`, [redirectId]);
    return { success: true, redirect: redirect };
}));
apiRouter.delete("/redirects/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = serverUtil_1.expectInt(req.params.id);
    const redirect = yield db.mysqlFirst(`SELECT * FROM chart_slug_redirects WHERE id = ?`, [id]);
    if (!redirect)
        throw new owidTypes_1.JsonError(`No redirect found for id ${id}`, 404);
    yield db.execute(`DELETE FROM chart_slug_redirects WHERE id=?`, [id]);
    yield triggerStaticBuild(res.locals.user, `Deleting redirect from ${redirect.slug}`);
    return { success: true };
}));
apiRouter.get("/posts.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield Post_1.Post.select("id", "title", "type", "status", "updated_at").from(db.knex().from(Post_1.Post.table).orderBy("updated_at", "desc"));
    const tagsByPostId = yield Post_1.Post.tagsByPostId();
    const authorship = yield wpdb.getAuthorship();
    for (const post of rows) {
        const postAsAny = post;
        postAsAny.authors = authorship.get(post.id) || [];
        postAsAny.tags = tagsByPostId.get(post.id) || [];
    }
    return { posts: rows.map((r) => string_1.camelCaseProperties(r)) };
}));
apiRouter.get("/newsletterPosts.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield wpdb.singleton.query(`
        SELECT
            ID AS id,
            post_name AS name,
            post_title AS title,
            post_modified_gmt AS updatedAt,
            post_date_gmt AS publishedAt,
            post_type AS type,
            post_status AS status,
            post_excerpt AS excerpt
        FROM wp_posts
        WHERE (post_type='post' OR post_type='page') AND post_status='publish'
        ORDER BY post_date_gmt DESC`);
    const permalinks = yield wpdb.getPermalinks();
    const featuresImages = yield wpdb.getFeaturedImages();
    const posts = rows.map((row) => {
        const slug = permalinks.get(row.id, row.name);
        return {
            id: row.id,
            title: row.title,
            updatedAt: row.updatedAt,
            publishedAt: row.publishedAt,
            type: row.type,
            status: row.status,
            excerpt: row.excerpt,
            slug: slug,
            imageUrl: featuresImages.get(row.id),
            url: `${serverSettings_2.BAKED_BASE_URL}/${slug}`,
        };
    });
    return { posts };
}));
apiRouter.post("/posts/:postId/setTags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = serverUtil_1.expectInt(req.params.postId);
    yield Post_1.Post.setTags(postId, req.body.tagIds);
    return { success: true };
}));
apiRouter.get("/posts/:postId.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = serverUtil_1.expectInt(req.params.postId);
    const post = (yield db
        .knexTable(Post_1.Post.table)
        .where({ id: postId })
        .select("*")
        .first());
    return string_1.camelCaseProperties(post);
}));
apiRouter.get("/importData.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all datasets from the importable namespace to match against
    const datasets = yield db.queryMysql(`SELECT id, name FROM datasets WHERE namespace='owid' ORDER BY name ASC`);
    // Get a unique list of all entities in the database (probably this won't scale indefinitely)
    const existingEntities = (yield db.queryMysql(`SELECT name FROM entities`)).map((e) => e.name);
    return { datasets, existingEntities };
}));
apiRouter.get("/importData/datasets/:datasetId.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const datasetId = serverUtil_1.expectInt(req.params.datasetId);
    const dataset = yield db.mysqlFirst(`
        SELECT d.id, d.namespace, d.name, d.description, d.updatedAt
        FROM datasets AS d
        WHERE d.id = ?
    `, [datasetId]);
    if (!dataset)
        throw new owidTypes_1.JsonError(`No dataset by id '${datasetId}'`, 404);
    const variables = yield db.queryMysql(`
        SELECT v.id, v.name
        FROM variables AS v
        WHERE v.datasetId = ?
    `, [datasetId]);
    dataset.variables = variables;
    return { dataset };
}));
apiRouter.post("/importDataset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const { dataset, entities, years, variables } = req.body;
    const newDatasetId = yield db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        let datasetId;
        if (dataset.id) {
            // Updating existing dataset
            datasetId = dataset.id;
            yield t.execute(`UPDATE datasets SET dataEditedAt=?, dataEditedByUserId=? WHERE id=?`, [now, userId, datasetId]);
        }
        else {
            // Creating new dataset
            const row = [
                dataset.name,
                "owid",
                "",
                now,
                now,
                now,
                userId,
                now,
                userId,
                userId,
                true,
            ];
            const datasetResult = yield t.execute(`INSERT INTO datasets (name, namespace, description, createdAt, updatedAt, dataEditedAt, dataEditedByUserId, metadataEditedAt, metadataEditedByUserId, createdByUserId, isPrivate) VALUES (?)`, [row]);
            datasetId = datasetResult.insertId;
        }
        // Find or create the dataset source
        // TODO probably merge source info into dataset table
        let sourceId;
        if (datasetId) {
            // Use first source (if any)
            const rows = yield t.query(`SELECT id FROM sources WHERE datasetId=? ORDER BY id ASC LIMIT 1`, [datasetId]);
            if (rows[0])
                sourceId = rows[0].id;
        }
        if (!sourceId) {
            // Insert default source
            const sourceRow = [dataset.name, "{}", now, now, datasetId];
            const sourceResult = yield t.execute(`INSERT INTO sources (name, description, createdAt, updatedAt, datasetId) VALUES (?)`, [sourceRow]);
            sourceId = sourceResult.insertId;
        }
        // Insert any new entities into the db
        const entitiesUniq = lodash.uniq(entities);
        const importEntityRows = entitiesUniq.map((e) => [
            e,
            false,
            now,
            now,
            "",
        ]);
        yield t.execute(`INSERT IGNORE entities (name, validated, createdAt, updatedAt, displayName) VALUES ?`, [importEntityRows]);
        // Map entities to entityIds
        const entityRows = yield t.query(`SELECT id, name FROM entities WHERE name IN (?)`, [entitiesUniq]);
        const entityIdLookup = {};
        console.log(lodash.difference(lodash.keys(entityIdLookup), entitiesUniq));
        for (const row of entityRows) {
            entityIdLookup[row.name] = row.id;
        }
        // Remove all existing variables not matched by overwriteId
        const existingVariables = yield t.query(`SELECT id FROM variables v WHERE v.datasetId=?`, [datasetId]);
        const removingVariables = existingVariables.filter((v) => !variables.some((v2) => v2.overwriteId === v.id));
        const removingVariableIds = removingVariables.map((v) => v.id);
        if (removingVariableIds.length) {
            yield t.execute(`DELETE FROM data_values WHERE variableId IN (?)`, [
                removingVariableIds,
            ]);
            yield t.execute(`DELETE FROM variables WHERE id IN (?)`, [
                removingVariableIds,
            ]);
        }
        // Overwrite old variables and insert new variables
        for (const variable of variables) {
            let variableId;
            if (variable.overwriteId) {
                // Remove any existing data values
                yield t.execute(`DELETE FROM data_values WHERE variableId=?`, [
                    variable.overwriteId,
                ]);
                variableId = variable.overwriteId;
            }
            else {
                const variableRow = [
                    variable.name,
                    datasetId,
                    sourceId,
                    now,
                    now,
                    "",
                    "",
                    "",
                    "{}",
                ];
                // Create a new variable
                // TODO migrate to clean up these fields
                const result = yield t.execute(`INSERT INTO variables (name, datasetId, sourceId, createdAt, updatedAt, unit, coverage, timespan, display) VALUES (?)`, [variableRow]);
                variableId = result.insertId;
            }
            const valueRows = [];
            for (let i = 0; i < variable.values.length; i++) {
                const value = variable.values[i];
                if (value !== "") {
                    valueRows.push([
                        value,
                        years[i],
                        entityIdLookup[entities[i]],
                        variableId,
                    ]);
                }
            }
            if (valueRows.length) {
                yield t.execute(`INSERT INTO data_values (value, year, entityId, variableId) VALUES ?`, [valueRows]);
            }
        }
        return datasetId;
    }));
    // Don't sync to git repo on import-- dataset is initially private
    //await syncDatasetToGitRepo(newDatasetId, { oldDatasetName: oldDatasetName, commitName: res.locals.user.fullName, commitEmail: res.locals.user.email })
    return { success: true, datasetId: newDatasetId };
}));
apiRouter.get("/sources/:sourceId.json", (req) => __awaiter(void 0, void 0, void 0, function* () {
    const sourceId = serverUtil_1.expectInt(req.params.sourceId);
    const source = yield db.mysqlFirst(`
        SELECT s.id, s.name, s.description, s.createdAt, s.updatedAt, d.namespace
        FROM sources AS s
        JOIN datasets AS d ON d.id=s.datasetId
        WHERE s.id=?`, [sourceId]);
    source.description = JSON.parse(source.description);
    source.variables = yield db.queryMysql(`SELECT id, name, updatedAt FROM variables WHERE variables.sourceId=?`, [sourceId]);
    return { source: source };
}));
apiRouter.get("/deploys.json", () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        deploys: yield new DeployQueueServer_1.DeployQueueServer().getDeploys(),
    });
}));
//# sourceMappingURL=apiRouter.js.map