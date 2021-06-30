import * as React from "react";
interface Position {
    x: number;
    y: number;
}
export declare class AmazonMenu extends React.Component<{
    children: React.ReactNode;
    submenuRect?: DOMRect | ClientRect | null;
    onActivate?: (submenuId: any) => void;
    onDeactivate?: (submenuId: any) => void;
}> {
    container: React.RefObject<HTMLDivElement>;
    activeSubmenuId?: string;
    mouseLocs: Position[];
    lastDelayLoc?: Position;
    timeoutId?: number;
    onMouseMove(event: React.MouseEvent<HTMLDivElement>): void;
    onMouseLeaveMenu(): void;
    onMouseEnterItem(submenuId: any): void;
    onClickItem(submenuId: any): void;
    possiblyActivate(submenuId: any): void;
    activate(submenuId: any): void;
    deactivate(submenuId: any): void;
    activationDelay(): 400 | 0;
    onMouseOver(event: React.MouseEvent<HTMLDivElement>): void;
    onClick(event: React.MouseEvent<HTMLDivElement>): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=AmazonMenu.d.ts.map