import React from "react";
declare type keyboardCombo = string;
export interface Command {
    combo: keyboardCombo;
    fn: () => void;
    title?: string;
    category?: string;
}
export declare class CommandPalette extends React.Component<{
    commands: Command[];
    display: "none" | "block";
}> {
    static togglePalette(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=CommandPalette.d.ts.map