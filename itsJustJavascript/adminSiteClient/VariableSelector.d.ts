import * as React from "react";
import * as lodash from "lodash";
import { IReactionDisposer } from "mobx";
import { ValueType } from "react-select";
import { ChartEditor, Dataset, Namespace } from "./ChartEditor";
import { LegacyVariableId } from "../clientUtils/owidTypes";
import { DimensionSlot } from "../grapher/chart/DimensionSlot";
interface VariableSelectorProps {
    editor: ChartEditor;
    slot: DimensionSlot;
    onDismiss: () => void;
    onComplete: (variableIds: LegacyVariableId[]) => void;
}
interface Variable {
    id: number;
    name: string;
    datasetName: string;
    searchKey?: Fuzzysort.Prepared;
}
export declare class VariableSelector extends React.Component<VariableSelectorProps> {
    chosenNamespace: Namespace | undefined;
    searchInput?: string;
    isProjection?: boolean;
    tolerance?: number;
    chosenVariables: Variable[];
    searchField: HTMLInputElement;
    scrollElement: HTMLDivElement;
    rowOffset: number;
    numVisibleRows: number;
    rowHeight: number;
    get database(): import("./ChartEditor").EditorDatabase;
    get currentNamespace(): Namespace;
    get editorData(): import("./ChartEditor").NamespaceData | undefined;
    get datasets(): Dataset[];
    get datasetsByName(): lodash.Dictionary<Dataset>;
    get availableVariables(): Variable[];
    get searchResults(): Variable[];
    get resultsByDataset(): {
        [datasetName: string]: Variable[];
    };
    get searchResultRows(): (string | Variable[])[];
    get numTotalRows(): number;
    formatNamespaceLabel(namespace: Namespace): JSX.Element;
    filterNamespace(option: any, input: string): boolean;
    render(): JSX.Element;
    onScroll(ev: React.UIEvent<HTMLDivElement>): void;
    onNamespace(selected: ValueType<Namespace>): void;
    onSearchInput(input: string): void;
    selectVariable(variable: Variable): void;
    unselectVariable(variable: Variable): void;
    toggleVariable(variable: Variable): void;
    onSearchEnter(): void;
    onDismiss(): void;
    dispose: IReactionDisposer;
    base: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    private initChosenVariables;
    componentWillUnmount(): void;
    onComplete(): void;
}
export {};
//# sourceMappingURL=VariableSelector.d.ts.map