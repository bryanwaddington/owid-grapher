import * as React from "react";
import { TimelineController } from "./TimelineController";
export declare class TimelineComponent extends React.Component<{
    timelineController: TimelineController;
}> {
    base: React.RefObject<HTMLDivElement>;
    private dragTarget?;
    private get isDragging();
    private get manager();
    private get controller();
    private get sliderBounds();
    private slider?;
    private playButton?;
    private getInputTimeFromMouse;
    private onDrag;
    private showTooltips;
    private getDragTarget;
    private onMouseDown;
    private queuedDrag?;
    private onMouseMove;
    private onMouseUp;
    private mouseHoveringOverTimeline;
    private onMouseOver;
    private onMouseLeave;
    private hideStartTooltip;
    private hideEndTooltip;
    onPlayTouchEnd(evt: Event): void;
    private get isPlayingOrDragging();
    componentDidMount(): void;
    componentWillUnmount(): void;
    private formatTime;
    private timelineEdgeMarker;
    private startTooltipVisible;
    private endTooltipVisible;
    private lastUpdatedTooltip?;
    private togglePlay;
    convertToTime(time: number): number;
    render(): JSX.Element;
}
//# sourceMappingURL=TimelineComponent.d.ts.map