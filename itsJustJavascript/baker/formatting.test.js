#! /usr/bin/env jest
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
const formatting_1 = require("./formatting");
it("parses formatting options", () => {
    const formattingOptions = "subnavId:coronavirus isTrue isAlsoTrue:true isFalse:false";
    expect(formatting_1.parseFormattingOptions(formattingOptions)).toStrictEqual({
        subnavId: "coronavirus",
        isTrue: true,
        isAlsoTrue: true,
        isFalse: false,
    });
});
it("parses LastUpdated options", () => {
    const lastUpdatedOptions = "timestampUrl:https://covid.ourworldindata.org/data/internal/timestamp/owid-covid-data-last-updated-timestamp-root.txt";
    expect(formatting_1.parseKeyValueArgs(lastUpdatedOptions)).toStrictEqual({
        timestampUrl: "https://covid.ourworldindata.org/data/internal/timestamp/owid-covid-data-last-updated-timestamp-root.txt",
    });
});
it("extracts DataValue tags configurations", () => __awaiter(void 0, void 0, void 0, function* () {
    const queryArgs = { year: 2001, variableId: 146684, entityId: 12 };
    const template = "%value %unit in %year in %entity";
    const dataValueConfigurationString = `year:${queryArgs.year} variableId:${queryArgs.variableId} entityId:${queryArgs.entityId} | ${template}`;
    const dataValueTag = `{{DataValue ${dataValueConfigurationString}}}`;
    const queryArgs2 = { year: 1990, variableId: 146, entityId: 13 };
    const template2 = "%unit in %year in %entity";
    const dataValueConfigurationString2 = `year:${queryArgs2.year}  variableId:${queryArgs2.variableId}  entityId:${queryArgs2.entityId}  |   ${template2}`;
    const dataValueTag2 = `{{  DataValue  ${dataValueConfigurationString2}    }}`;
    const html = `Lorem ipsum dolor ${dataValueTag}. <span>sit amet</span>
                  Fusce eu vestibulum ${dataValueTag2} urna, at laoreet ${dataValueTag2} purus.`;
    const dataValuesConfigurationsMap = new Map();
    dataValuesConfigurationsMap.set(dataValueConfigurationString, {
        queryArgs,
        template,
    });
    dataValuesConfigurationsMap.set(dataValueConfigurationString2, {
        queryArgs: queryArgs2,
        template: template2,
    });
    expect(yield formatting_1.extractDataValuesConfiguration(html)).toEqual(dataValuesConfigurationsMap);
}));
//# sourceMappingURL=formatting.test.js.map