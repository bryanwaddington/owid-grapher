import { RefObject } from "react";
export declare const useTriggerWhenClickOutside: (container: RefObject<HTMLElement>, active: boolean, trigger: (arg0: boolean) => void) => void;
export declare enum ScrollDirection {
    Up = "up",
    Down = "down"
}
export declare const useScrollDirection: () => ScrollDirection | null;
//# sourceMappingURL=hooks.d.ts.map