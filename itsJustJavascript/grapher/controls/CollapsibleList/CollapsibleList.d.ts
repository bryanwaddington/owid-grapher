import React from "react";
/** A UI component inspired by the "Priority+ Navbar" or "Progressively Collapsing Navbar"*/
export declare class CollapsibleList extends React.Component {
    private outerContainerRef;
    private moreButtonRef;
    private outerContainerWidth;
    private moreButtonWidth;
    private itemsWidths;
    private numItemsVisible?;
    private get children();
    private updateOuterContainerWidth;
    private calculateItemWidths;
    private updateNumItemsVisible;
    private get visibleItems();
    private get dropdownItems();
    private onResize;
    private updateItemVisibility;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class MoreButton extends React.Component<{
    options: React.ReactElement[];
}> {
    render(): JSX.Element;
}
/**
 * Given: an array of item widths, a container width, and a starting width
 * Returns the number of items that can fit in the container
 */
export declare function numItemsVisible(itemWidths: number[], containerWidth: number, startingWidth?: number): number;
//# sourceMappingURL=CollapsibleList.d.ts.map