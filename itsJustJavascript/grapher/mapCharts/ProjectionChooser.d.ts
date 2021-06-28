import * as React from "react";
import { ValueType } from "react-select";
import { MapProjectionName } from "./MapProjections";
interface ProjectionChooserEntry {
    label: string;
    value: MapProjectionName;
}
export declare class ProjectionChooser extends React.Component<{
    value: string;
    onChange: (value: MapProjectionName) => void;
}> {
    onChange(selected: ValueType<ProjectionChooserEntry>): void;
    get options(): {
        value: MapProjectionName;
        label: string;
    }[];
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=ProjectionChooser.d.ts.map