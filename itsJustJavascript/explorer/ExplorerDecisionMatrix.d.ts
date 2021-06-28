import { ChoiceName, ChoiceValue, ExplorerChoice, ExplorerChoiceParams } from "./ExplorerConstants";
export declare class DecisionMatrix {
    private table;
    currentParams: ExplorerChoiceParams;
    constructor(delimited: string, hash?: string);
    allDecisionsAsQueryParams(): ExplorerChoiceParams[];
    get numRows(): number;
    get requiredGrapherIds(): any[];
    private choices;
    hash: string;
    toConstrainedOptions(): ExplorerChoiceParams;
    private get diffBetweenUserSettingsAndConstrained();
    setValueCommand(choiceName: ChoiceName, value: ChoiceValue): void;
    private _setValue;
    setValuesFromChoiceParams(choiceParams?: ExplorerChoiceParams): this;
    private get choiceNames();
    private get allChoiceOptions();
    private get availableChoiceOptions();
    private firstAvailableOptionForChoice;
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
    isOptionAvailable(choiceName: ChoiceName, option: ChoiceValue, currentState?: ExplorerChoiceParams): boolean;
    private rowsWith;
    private get firstMatch();
    get selectedRowIndex(): any;
    selectedRow: any;
    private toControlOption;
    get choicesWithAvailability(): ExplorerChoice[];
    toString(): string;
}
//# sourceMappingURL=ExplorerDecisionMatrix.d.ts.map