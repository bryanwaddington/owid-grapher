"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSelectedEntityNamesParam = exports.getSelectedEntityNamesParam = exports.migrateSelectedEntityNamesParam = exports.ENTITY_V2_DELIMITER = void 0;
const EntityCodes_1 = require("./EntityCodes");
const UrlMigration_1 = require("../../clientUtils/urls/UrlMigration");
/*
 * Migration #1: Switch from + to ~ delimited entities.
 *
 * Implemented: May 2020
 *
 * See PR discussion on how we decided on ~ (tilde): https://github.com/owid/owid-grapher/pull/446
 * And the initial issue (Facebook rewriting our URLs): https://github.com/owid/owid-grapher/issues/397
 *
 * In short:
 *
 * Facebook replaces `%20` in URLs with `+`. Before this migration we encoded
 * ["North America", "South America"] → "North%20America+South%20America".
 * Facebook would turn this into "North+America+South+America" making the delimiters and spaces
 * ambiguous.
 *
 * We chose ~ (tilde) because no entities existed in the database that contain that symbol, so the
 * existence of that symbol could be used to detect legacy URLs.
 *
 */
// Todo: ensure EntityName never contains the v2Delimiter
const V1_DELIMITER = "+";
exports.ENTITY_V2_DELIMITER = "~";
const isV1Param = (encodedQueryParam) => {
    // No legacy entities have a v2Delimiter in their name,
    // so if a v2Delimiter is present we know it's a v2 link.
    return !decodeURIComponent(encodedQueryParam).includes(exports.ENTITY_V2_DELIMITER);
};
const entityNamesFromV1EncodedParam = (encodedQueryParam) => {
    // need to use still-encoded URL params because we need to
    // distinguish between `+` and `%20` in legacy URLs
    return encodedQueryParam.split(V1_DELIMITER).map(decodeURIComponent);
};
const entityNamesToV2Param = (entityNames) => {
    // Always include a v2Delimiter in a v2 link. When decoding we will drop any empty strings.
    if (entityNames.length === 1)
        return exports.ENTITY_V2_DELIMITER + entityNames[0];
    return entityNames.join(exports.ENTITY_V2_DELIMITER);
};
const entityNamesFromV2Param = (queryParam) => {
    // Facebook turns %20 into +. v2 links will never contain a +, so we can safely replace all of them with %20.
    return queryParam.split(exports.ENTITY_V2_DELIMITER).filter((item) => item);
};
const migrateV1Delimited = (url) => {
    const { country } = url.encodedQueryParams;
    if (country !== undefined && isV1Param(country)) {
        return url.updateQueryParams({
            country: entityNamesToV2Param(entityNamesFromV1EncodedParam(country)),
        });
    }
    return url;
};
/*
 * Migration #2: Drop dimension keys from selected entities.
 *
 * Implemented: March 2021
 *
 * When plotting multiple variables on a chart, it used to be possible to pick which
 * variable-entity pairs get plotted.
 *
 * For example, if you had a line chart with 3 variables: Energy consumption from Coal, Oil and Gas,
 * then you (as a user) could select individual variable-entity pairs to plot:
 *
 * - France - Coal ("FRA-0")
 * - France - Oil ("FRA-1")
 * - France - Gas ("FRA-2")
 * - ...
 *
 * The index of the dimension was appended to the entity (e.g. 0 for Coal).
 *
 * We dropped this feature in March 2021 in order to simplify the selection-handling logic, and it
 * was also, in most cases, not desirable to present users with variable-entity options.
 *
 */
const LegacyDimensionRegex = /\-\d+$/;
const injectEntityNamesInLegacyDimension = (entityNames) => {
    // If an entity has the old name-dimension encoding, removing the dimension part and add it as
    // a new selection. So USA-1 becomes USA.
    const newNames = [];
    entityNames.forEach((entityName) => {
        newNames.push(entityName);
        if (LegacyDimensionRegex.test(entityName)) {
            const nonDimensionName = entityName.replace(LegacyDimensionRegex, "");
            newNames.push(nonDimensionName);
        }
    });
    return newNames;
};
const migrateLegacyDimensionPairs = (url) => {
    const { country } = url.queryParams;
    if (country) {
        return url.updateQueryParams({
            country: entityNamesToV2Param(injectEntityNamesInLegacyDimension(entityNamesFromV2Param(country))),
        });
    }
    return url;
};
/*
 * Combining all migrations
 */
const urlMigrations = [
    migrateV1Delimited,
    migrateLegacyDimensionPairs,
];
const migrateSelectedEntityNamesParam = (url) => {
    return UrlMigration_1.performUrlMigrations(urlMigrations, url);
};
exports.migrateSelectedEntityNamesParam = migrateSelectedEntityNamesParam;
/*
 * Accessors
 */
const getSelectedEntityNamesParam = (url) => {
    const { country } = exports.migrateSelectedEntityNamesParam(url).queryParams;
    return country !== undefined
        ? entityNamesFromV2Param(country).map(EntityCodes_1.codeToEntityName)
        : undefined;
};
exports.getSelectedEntityNamesParam = getSelectedEntityNamesParam;
const setSelectedEntityNamesParam = (url, entityNames) => {
    return exports.migrateSelectedEntityNamesParam(url).updateQueryParams({
        country: entityNames
            ? entityNamesToV2Param(entityNames.map(EntityCodes_1.entityNameToCode))
            : undefined,
    });
};
exports.setSelectedEntityNamesParam = setSelectedEntityNamesParam;
//# sourceMappingURL=EntityUrlBuilder.js.map