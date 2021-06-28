import * as React from "react";
import { IReactionDisposer } from "mobx";
import { SelectionArray } from "../../selection/SelectionArray";
declare enum GlobalEntitySelectionModes {
    none = "none",
    override = "override"
}
export declare class GlobalEntitySelector extends React.Component<{
    selection: SelectionArray;
    graphersAndExplorersToUpdate?: Set<SelectionArray>;
    environment?: string;
}> {
    refContainer: React.RefObject<HTMLDivElement>;
    disposers: IReactionDisposer[];
    mode: GlobalEntitySelectionModes;
    private isNarrow;
    private isOpen;
    private localEntityName;
    selection: SelectionArray;
    private optionGroups;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onResizeThrottled;
    private onResize;
    populateLocalEntity(): Promise<void>;
    private prepareOptionGroups;
    private analytics;
    private updateURL;
    updateSelection(newSelectedEntities: string[]): void;
    private onChange;
    private updateAllGraphersAndExplorersOnPage;
    private onRemove;
    private onMenuOpen;
    private onMenuClose;
    private onButtonOpen;
    private onButtonClose;
    private get selectedOptions();
    private renderNarrow;
    private renderWide;
    render(): JSX.Element;
}
export declare const hydrateGlobalEntitySelectorIfAny: (selection: SelectionArray, graphersAndExplorersToUpdate: Set<SelectionArray>) => void;
export {};
//# sourceMappingURL=GlobalEntitySelector.d.ts.map