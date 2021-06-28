"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynthesizeFruitTableWithStringValues = exports.SynthesizeFruitTableWithNonPositives = exports.SynthesizeFruitTable = exports.SynthesizeGDPTable = exports.SampleColumnSlugs = exports.SynthesizeNonCountryTable = void 0;
const Util_1 = require("../clientUtils/Util");
const countries_1 = require("../clientUtils/countries");
const CoreColumnDef_1 = require("./CoreColumnDef");
const OwidTable_1 = require("./OwidTable");
const OwidTableConstants_1 = require("./OwidTableConstants");
const SynthesizeOwidTable = (options, seed = Date.now()) => {
    const finalOptions = Object.assign({ entityNames: [], entityCount: 2, timeRange: [1950, 2020], columnDefs: [] }, options);
    const { entityCount, columnDefs, timeRange, entityNames } = finalOptions;
    const colSlugs = [
        OwidTableConstants_1.OwidTableSlugs.entityName,
        OwidTableConstants_1.OwidTableSlugs.entityCode,
        OwidTableConstants_1.OwidTableSlugs.entityId,
        OwidTableConstants_1.OwidTableSlugs.year,
    ].concat(columnDefs.map((col) => col.slug));
    const entities = entityNames.length
        ? entityNames.map((name) => {
            return {
                name,
                code: name.substr(0, 3).toUpperCase(),
            };
        })
        : Util_1.sampleFrom(countries_1.countries, entityCount, seed);
    const rows = entities.map((entity, index) => {
        let values = columnDefs.map((def) => def.generator());
        return Util_1.range(timeRange[0], timeRange[1])
            .map((year) => {
            values = columnDefs.map((def, index) => Math.round(values[index] * (1 + def.growthRateGenerator() / 100)));
            return [entity.name, entity.code, index, year, ...values].join(",");
        })
            .join("\n");
    });
    return new OwidTable_1.OwidTable(`${colSlugs.join(",")}\n${rows.join("\n")}`, columnDefs);
};
const SynthesizeNonCountryTable = (options, seed = Date.now()) => SynthesizeOwidTable(Object.assign({ entityNames: ["Fire", "Earthquake", "Tornado"], columnDefs: [
        {
            slug: SampleColumnSlugs.Disasters,
            type: CoreColumnDef_1.ColumnTypeNames.Integer,
            generator: Util_1.getRandomNumberGenerator(0, 20, seed),
            growthRateGenerator: Util_1.getRandomNumberGenerator(-50, 50, seed),
        },
    ] }, options), seed);
exports.SynthesizeNonCountryTable = SynthesizeNonCountryTable;
var SampleColumnSlugs;
(function (SampleColumnSlugs) {
    SampleColumnSlugs["Population"] = "Population";
    SampleColumnSlugs["GDP"] = "GDP";
    SampleColumnSlugs["LifeExpectancy"] = "LifeExpectancy";
    SampleColumnSlugs["Fruit"] = "Fruit";
    SampleColumnSlugs["Vegetables"] = "Vegetables";
    SampleColumnSlugs["Disasters"] = "Disasters";
})(SampleColumnSlugs = exports.SampleColumnSlugs || (exports.SampleColumnSlugs = {}));
const SynthesizeGDPTable = (options, seed = Date.now(), display) => SynthesizeOwidTable(Object.assign({ columnDefs: [
        {
            slug: SampleColumnSlugs.Population,
            type: CoreColumnDef_1.ColumnTypeNames.Population,
            source: SynthSource(SampleColumnSlugs.Population),
            generator: Util_1.getRandomNumberGenerator(1e7, 1e9, seed),
            growthRateGenerator: Util_1.getRandomNumberGenerator(-5, 5, seed),
            display,
        },
        {
            slug: SampleColumnSlugs.GDP,
            type: CoreColumnDef_1.ColumnTypeNames.Currency,
            source: SynthSource(SampleColumnSlugs.GDP),
            generator: Util_1.getRandomNumberGenerator(1e9, 1e12, seed),
            growthRateGenerator: Util_1.getRandomNumberGenerator(-15, 15, seed),
            display,
        },
        {
            slug: SampleColumnSlugs.LifeExpectancy,
            type: CoreColumnDef_1.ColumnTypeNames.Age,
            source: SynthSource(SampleColumnSlugs.LifeExpectancy),
            generator: Util_1.getRandomNumberGenerator(60, 90, seed),
            growthRateGenerator: Util_1.getRandomNumberGenerator(-2, 2, seed),
            display,
        },
    ] }, options), seed);
exports.SynthesizeGDPTable = SynthesizeGDPTable;
const SynthSource = (name) => {
    return {
        id: name.charCodeAt(0) + name.charCodeAt(1) + name.charCodeAt(2),
        name: `${name} Almanac`,
        dataPublishedBy: `${name} Synthetic Data Team`,
        dataPublisherSource: `${name} Institute`,
        link: "http://foo.example",
        retrievedDate: "1/1/2000",
        additionalInfo: `Downloaded via FTP`,
    };
};
const SynthesizeFruitTable = (options, seed = Date.now()) => SynthesizeOwidTable(Object.assign({ columnDefs: [
        {
            slug: SampleColumnSlugs.Fruit,
            type: CoreColumnDef_1.ColumnTypeNames.Numeric,
            source: SynthSource(SampleColumnSlugs.Fruit),
            generator: Util_1.getRandomNumberGenerator(500, 1000, seed),
            growthRateGenerator: Util_1.getRandomNumberGenerator(-10, 10, seed),
        },
        {
            slug: SampleColumnSlugs.Vegetables,
            type: CoreColumnDef_1.ColumnTypeNames.Numeric,
            source: SynthSource(SampleColumnSlugs.Vegetables),
            generator: Util_1.getRandomNumberGenerator(400, 1000, seed),
            growthRateGenerator: Util_1.getRandomNumberGenerator(-10, 12, seed),
        },
    ] }, options), seed);
exports.SynthesizeFruitTable = SynthesizeFruitTable;
const SynthesizeFruitTableWithNonPositives = (options, howManyNonPositives = 20, seed = Date.now()) => {
    const rand = Util_1.getRandomNumberGenerator(-1000, 0);
    return exports.SynthesizeFruitTable(options, seed).replaceRandomCells(howManyNonPositives, [SampleColumnSlugs.Fruit, SampleColumnSlugs.Vegetables], undefined, () => rand());
};
exports.SynthesizeFruitTableWithNonPositives = SynthesizeFruitTableWithNonPositives;
const stringValues = ["NA", "inf", "..", "/", "-", "#VALUE!"];
const SynthesizeFruitTableWithStringValues = (options, howMany = 20, seed = Date.now()) => {
    return exports.SynthesizeFruitTable(options, seed).replaceRandomCells(howMany, [SampleColumnSlugs.Fruit, SampleColumnSlugs.Vegetables], undefined, () => Util_1.sampleFrom(stringValues, 1, Date.now())[0]);
};
exports.SynthesizeFruitTableWithStringValues = SynthesizeFruitTableWithStringValues;
//# sourceMappingURL=OwidTableSynthesizers.js.map