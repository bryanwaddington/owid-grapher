import { SelectionArray } from "../../grapher/selection/SelectionArray";
import { Annotation } from "../../clientUtils/owidTypes";
export declare const shouldProgressiveEmbed: () => boolean;
declare class MultiEmbedder {
    private figuresObserver;
    selection: SelectionArray;
    graphersAndExplorersToUpdate: Set<SelectionArray>;
    constructor();
    /**
     * Finds all <figure data-grapher-src="..."> and <figure
     * data-explorer-src="..."> elements in the document and loads the
     * iframeless interactive charts when the user's viewport approaches them.
     * Uses an IntersectionObserver (see constructor).
     *
     * BEWARE: this method is hardcoded in some scripts, make sure to check
     * thoroughly before making any changes.
     */
    embedAll(): void;
    /**
     * Make the embedder aware of new <figure> elements that are injected into the DOM.
     *
     * Use this when you programmatically create/replace charts.
     */
    observeFigures(container?: HTMLElement | Document): void;
    onIntersecting(entries: IntersectionObserverEntry[]): Promise<void>;
    renderInteractiveFigure(figure: Element, annotation?: Annotation): Promise<void>;
    setUpGlobalEntitySelectorForEmbeds(): void;
}
export declare const MultiEmbedderSingleton: MultiEmbedder;
export {};
//# sourceMappingURL=MultiEmbedder.d.ts.map