export interface SlideShowManager<SlideData> {
    setSlide: (slide: SlideData) => void;
}
export declare class SlideShowController<SlideData> {
    constructor(slides?: SlideData[], currentIndex?: number, manager?: SlideShowManager<SlideData>);
    private slides;
    private currentIndex;
    private manager?;
    get isEmpty(): boolean;
    private playIndexCommand;
    playNext(): void;
    playPrevious(): void;
}
//# sourceMappingURL=SlideShowController.d.ts.map