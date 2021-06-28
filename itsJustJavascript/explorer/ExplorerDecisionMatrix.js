"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionMatrix = void 0;
const mobx_1 = require("mobx");
const UrlUtils_1 = require("../clientUtils/urls/UrlUtils");
const Util_1 = require("../clientUtils/Util");
const CoreColumnDef_1 = require("../coreTable/CoreColumnDef");
const CoreTable_1 = require("../coreTable/CoreTable");
const CoreTableUtils_1 = require("../coreTable/CoreTableUtils");
const GridLangConstants_1 = require("../gridLang/GridLangConstants");
const ExplorerConstants_1 = require("./ExplorerConstants");
const ExplorerProgram_1 = require("./ExplorerProgram");
const GrapherGrammar_1 = require("./GrapherGrammar");
// todo: cleanup
const makeChoicesMap = (delimited) => {
    const headerLine = delimited.split("\n")[0];
    const map = new Map();
    headerLine
        .split(CoreTableUtils_1.detectDelimiter(headerLine))
        .filter((name) => ExplorerConstants_1.ExplorerControlTypeRegex.test(name))
        .forEach((choiceNameAndType) => {
        const words = choiceNameAndType.split(" ");
        const [choiceName, choiceType] = [
            words.slice(0, -1).join(" "),
            words[words.length - 1],
        ];
        map.set(choiceName, choiceType);
    });
    return map;
};
// This strips the "Dropdown" or "Checkbox" from "SomeChoice Dropdown" or "SomeChoice Checkbox"
const removeChoiceControlTypeInfo = (label) => label.replace(ExplorerConstants_1.ExplorerControlTypeRegex, "");
const dropColumnTypes = (delimited) => {
    const rows = delimited.split("\n");
    const delimiter = CoreTableUtils_1.detectDelimiter(rows[0]);
    rows[0] = rows[0]
        .split(delimiter)
        .map(removeChoiceControlTypeInfo)
        .join(delimiter);
    return rows.join("\n");
};
const makeCheckBoxOption = (options, choiceName) => {
    const checked = options.some((option) => option.checked === true && option.value === GridLangConstants_1.GridBoolean.true);
    const available = new Set(options.filter((opt) => opt.available).map((opt) => opt.label))
        .size === 2;
    return [
        {
            label: choiceName,
            checked,
            value: GridLangConstants_1.GridBoolean.true,
            available,
        },
    ];
};
// Takes the author's program and the user's current settings and returns an object for
// allow the user to navigate amongst charts.
class DecisionMatrix {
    constructor(delimited, hash = "") {
        this.currentParams = {};
        this.selectedRow = {};
        this.choices = makeChoicesMap(delimited);
        this.table = new CoreTable_1.CoreTable(CoreTableUtils_1.parseDelimited(dropColumnTypes(delimited)), [
            // todo: remove col def?
            {
                slug: GrapherGrammar_1.GrapherGrammar.grapherId.keyword,
                type: CoreColumnDef_1.ColumnTypeNames.Integer,
            },
        ]);
        this.hash = hash;
        this.setValuesFromChoiceParams(); // Initialize options
    }
    allDecisionsAsQueryParams() {
        return this.table.rows.map((row) => {
            const choiceParams = {};
            this.choiceNames.forEach((name) => {
                choiceParams[name] = row[name];
            });
            return choiceParams;
        });
    }
    get numRows() {
        return this.table.numRows;
    }
    get requiredGrapherIds() {
        return this.table.get(GrapherGrammar_1.GrapherGrammar.grapherId.keyword).uniqValues;
    }
    toConstrainedOptions() {
        const settings = Object.assign({}, this.currentParams);
        this.choiceNames.forEach((choiceName) => {
            if (!this.isOptionAvailable(choiceName, settings[choiceName], settings)) {
                settings[choiceName] = this.firstAvailableOptionForChoice(choiceName, settings);
            }
        });
        return settings;
    }
    get diffBetweenUserSettingsAndConstrained() {
        return Util_1.differenceObj(this.toConstrainedOptions(), this.currentParams);
    }
    setValueCommand(choiceName, value) {
        this._setValue(choiceName, value);
        const invalidState = this.diffBetweenUserSettingsAndConstrained;
        Object.keys(invalidState).forEach((key) => {
            // If a user navigates to a state where an option previously selected is not available,
            // then persist the new option, as long as it isn't the only one available.
            //
            // For example, if the user navigates from metric:Cases interval:Weekly, to
            // metric:Vaccinations, if interval:Weekly is not available for Vaccinations but other
            // (more than one) intervals are available, we will persist whichever we happen to end
            // up on.
            //
            // But if the user navigates from metric:Cases perCapita:true, to
            // metric:Share of positive tests, then the only available perCapita option is false,
            // but it isn't persisted, because the user has no other options. It's non-sensical to
            // ask for "Share of positive tests per capita", so qualitatively it's a different
            // metric, and the perCapita can just be ignored.
            //
            // We assume in every case where the user has only a single option available (therefore
            // has no choice) the option should not be persisted.
            if (this.availableChoiceOptions[key].length > 1) {
                this._setValue(key, invalidState[key]);
            }
        });
    }
    _setValue(choiceName, value) {
        if (value === "")
            delete this.currentParams[choiceName];
        else
            this.currentParams[choiceName] = value;
        this.selectedRow = ExplorerProgram_1.trimAndParseObject(this.table.rowsAt([this.selectedRowIndex])[0], GrapherGrammar_1.GrapherGrammar);
    }
    setValuesFromChoiceParams(choiceParams = {}) {
        this.choiceNames.forEach((choiceName) => {
            if (choiceParams[choiceName] === undefined)
                this._setValue(choiceName, this.firstAvailableOptionForChoice(choiceName));
            else
                this._setValue(choiceName, choiceParams[choiceName]);
        });
        return this;
    }
    get choiceNames() {
        return Array.from(this.choices.keys());
    }
    get allChoiceOptions() {
        const choiceMap = {};
        this.choiceNames.forEach((choiceName) => {
            choiceMap[choiceName] = this.table
                .get(choiceName)
                .uniqValues.filter((cell) => !CoreTableUtils_1.isCellEmpty(cell));
        });
        return choiceMap;
    }
    get availableChoiceOptions() {
        const result = {};
        this.choiceNames.forEach((choiceName) => {
            result[choiceName] = this.allChoiceOptions[choiceName].filter((option) => this.isOptionAvailable(choiceName, option));
        });
        return result;
    }
    firstAvailableOptionForChoice(choiceName, currentState = this.currentParams) {
        return this.allChoiceOptions[choiceName].find((option) => this.isOptionAvailable(choiceName, option, currentState));
    }
    /**
     * Note: there is a rare bug in here + rowsWith when an author has a complex decision matrix. If the user vists a url
     * with invalid options like Metric="Tests", Interval="Weekly", Aligned="false"
     * we will return first match, which is B1, even though B2 is a better match.
     *
     * graphers
     * title	Metric Radio	Interval Radio	Aligned Checkbox
     * A1	Cases	Cumulative	true
     * A2	Cases	Cumulative	false
     * A3	Cases	Weekly	false
     *
     * B1	Tests	Cumulative	true
     * B2	Tests	Cumulative	false
     */
    isOptionAvailable(choiceName, option, currentState = this.currentParams) {
        const query = {};
        this.choiceNames
            .slice(0, this.choiceNames.indexOf(choiceName))
            .forEach((name) => {
            query[name] = currentState[name];
        });
        query[choiceName] = option;
        return this.rowsWith(query, choiceName).length > 0;
    }
    rowsWith(query, choiceName) {
        // We allow other options to be blank.
        const modifiedQuery = {};
        Object.keys(Util_1.trimObject(query)).forEach((queryColumn) => {
            if (queryColumn !== choiceName)
                // Blanks are fine if we are not talking about the column of interest
                modifiedQuery[queryColumn] = [query[queryColumn], ""];
            else
                modifiedQuery[queryColumn] = query[queryColumn];
        });
        return this.table.findRows(modifiedQuery);
    }
    get firstMatch() {
        const query = this.toConstrainedOptions();
        const hits = this.rowsWith(query);
        return hits[0];
    }
    get selectedRowIndex() {
        return this.firstMatch === undefined
            ? 0
            : this.table.indexOf(this.firstMatch);
    }
    toControlOption(choiceName, optionName, currentValue, constrainedOptions) {
        const available = this.isOptionAvailable(choiceName, optionName, constrainedOptions);
        return {
            label: optionName,
            value: optionName,
            available,
            checked: currentValue === optionName,
        };
    }
    get choicesWithAvailability() {
        const selectedRow = this.selectedRow;
        const constrainedOptions = this.toConstrainedOptions();
        return this.choiceNames.map((title) => {
            const value = selectedRow[title] !== undefined
                ? selectedRow[title].toString()
                : selectedRow[title];
            const options = this.allChoiceOptions[title].map((optionName) => this.toControlOption(title, optionName, value, constrainedOptions));
            const type = this.choices.get(title);
            return {
                title,
                displayTitle: title,
                type,
                value,
                options: type === ExplorerConstants_1.ExplorerControlType.Checkbox
                    ? makeCheckBoxOption(options, title)
                    : options,
            };
        });
    }
    toString() {
        return UrlUtils_1.queryParamsToStr(this.currentParams);
    }
}
__decorate([
    mobx_1.observable
], DecisionMatrix.prototype, "currentParams", void 0);
__decorate([
    mobx_1.computed
], DecisionMatrix.prototype, "diffBetweenUserSettingsAndConstrained", null);
__decorate([
    mobx_1.action.bound
], DecisionMatrix.prototype, "setValueCommand", null);
__decorate([
    mobx_1.action.bound
], DecisionMatrix.prototype, "_setValue", null);
__decorate([
    mobx_1.action.bound
], DecisionMatrix.prototype, "setValuesFromChoiceParams", null);
__decorate([
    mobx_1.computed
], DecisionMatrix.prototype, "choiceNames", null);
__decorate([
    mobx_1.computed
], DecisionMatrix.prototype, "allChoiceOptions", null);
__decorate([
    mobx_1.computed
], DecisionMatrix.prototype, "availableChoiceOptions", null);
__decorate([
    mobx_1.observable
], DecisionMatrix.prototype, "selectedRow", void 0);
__decorate([
    mobx_1.computed
], DecisionMatrix.prototype, "choicesWithAvailability", null);
exports.DecisionMatrix = DecisionMatrix;
//# sourceMappingURL=ExplorerDecisionMatrix.js.map