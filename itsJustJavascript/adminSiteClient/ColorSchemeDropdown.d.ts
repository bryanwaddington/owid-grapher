import * as React from "react";
import { ValueType } from "react-select";
import { ColorScheme } from "../grapher/color/ColorScheme";
export interface ColorSchemeOption {
    colorScheme?: ColorScheme;
    gradient?: string;
    label: string;
    value: string;
}
interface ColorSchemeDropdownProps {
    additionalOptions: ColorSchemeOption[];
    value?: string;
    gradientColorCount: number;
    invertedColorScheme: boolean;
    onChange: (selected: ColorSchemeOption) => void;
}
export declare class ColorSchemeDropdown extends React.Component<ColorSchemeDropdownProps> {
    static defaultProps: {
        additionalOptions: never[];
        gradientColorCount: number;
        invertedColorScheme: boolean;
    };
    get additionalOptions(): ColorSchemeOption[];
    get gradientColorCount(): number;
    get colorSchemeOptions(): {
        colorScheme: ColorScheme;
        gradient: string;
        label: string;
        value: string;
    }[];
    get allOptions(): ColorSchemeOption[];
    createLinearGradient(colorScheme: ColorScheme, count: number): string;
    onChange(selected: ValueType<ColorSchemeOption>): void;
    formatOptionLabel(option: ColorSchemeOption): JSX.Element;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=ColorSchemeDropdown.d.ts.map