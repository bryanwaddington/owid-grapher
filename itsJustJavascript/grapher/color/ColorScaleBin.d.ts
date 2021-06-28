import { Color } from "../../coreTable/CoreTableConstants";
interface BinProps {
    color: Color;
    label?: string;
}
interface NumericBinProps extends BinProps {
    isFirst: boolean;
    isOpenLeft: boolean;
    isOpenRight: boolean;
    min: number;
    max: number;
    displayMin: string;
    displayMax: string;
}
interface CategoricalBinProps extends BinProps {
    index: number;
    value: string;
    label: string;
    isHidden?: boolean;
}
declare abstract class AbstractColorScaleBin<T extends BinProps> {
    props: T;
    constructor(props: T);
    get color(): string;
    get label(): string | undefined;
}
export declare class NumericBin extends AbstractColorScaleBin<NumericBinProps> {
    get min(): number;
    get max(): number;
    get minText(): string;
    get maxText(): string;
    get text(): string;
    get isHidden(): boolean;
    contains(value: string | number | undefined): boolean;
    equals(other: ColorScaleBin): boolean;
}
export declare class CategoricalBin extends AbstractColorScaleBin<CategoricalBinProps> {
    get index(): number;
    get value(): string;
    get isHidden(): boolean | undefined;
    get text(): string;
    contains(value: string | number | undefined): boolean;
    equals(other: ColorScaleBin): boolean;
}
export declare type ColorScaleBin = CategoricalBin | NumericBin;
export {};
//# sourceMappingURL=ColorScaleBin.d.ts.map