import { Time } from "../../coreTable/CoreTableConstants";
import { TimeBound } from "../../clientUtils/TimeBounds";
export interface TimelineManager {
    disablePlay?: boolean;
    formatTimeFn?: (time: Time) => string;
    isPlaying?: boolean;
    userHasSetTimeline?: boolean;
    times: Time[];
    startHandleTimeBound: TimeBound;
    endHandleTimeBound: TimeBound;
    msPerTick?: number;
    onPlay?: () => void;
}
export declare class TimelineController {
    manager: TimelineManager;
    constructor(manager: TimelineManager);
    private get timesAsc();
    private get startTime();
    private get endTime();
    get minTime(): number;
    get maxTime(): number;
    get startTimeProgress(): number;
    get endTimeProgress(): number;
    getNextTime(time: number): number;
    private rangeMode;
    toggleRangeMode(): this;
    private isAtEnd;
    private resetToBeginning;
    play(numberOfTicks?: number): Promise<number>;
    private stop;
    private pause;
    togglePlay(): Promise<void>;
    private dragOffsets;
    setDragOffsets(inputTime: number): void;
    getTimeBoundFromDrag(inputTime: Time): TimeBound;
    private dragRangeToTime;
    dragHandleToTime(handle: "start" | "end" | "both", inputTime: number): "start" | "end" | "both";
    private updateStartTime;
    private updateEndTime;
    resetStartToMin(): void;
    resetEndToMax(): void;
}
//# sourceMappingURL=TimelineController.d.ts.map