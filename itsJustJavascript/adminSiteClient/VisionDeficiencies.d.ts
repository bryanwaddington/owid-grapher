import React from "react";
import { GroupedOptionsType, ValueType } from "react-select";
export interface VisionDeficiency {
    id: string;
    name: string;
    group: string;
    alternativeName: string;
    affected: string;
    transformationMatrix: string;
}
export declare const VisionDeficiencySvgFilters: () => JSX.Element;
interface VisionDeficiencyDropdownProps {
    value?: string;
    onChange: (selected: VisionDeficiencyEntity) => void;
}
export interface VisionDeficiencyEntity {
    label: string;
    value: string;
    deficiency?: VisionDeficiency;
}
export declare class VisionDeficiencyDropdown extends React.Component<VisionDeficiencyDropdownProps> {
    noDeficiencyOption: {
        label: string;
        value: string;
    };
    get options(): GroupedOptionsType<VisionDeficiencyEntity>;
    onChange(selected: ValueType<VisionDeficiencyEntity>): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=VisionDeficiencies.d.ts.map