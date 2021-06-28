import * as React from "react";
export declare class FieldsRow extends React.Component {
    render(): JSX.Element;
}
interface TextFieldProps extends React.HTMLAttributes<HTMLInputElement> {
    label?: string;
    value: string | undefined;
    onValue: (value: string) => void;
    onEnter?: () => void;
    onEscape?: () => void;
    placeholder?: string;
    title?: string;
    disabled?: boolean;
    helpText?: string;
    autofocus?: boolean;
    required?: boolean;
    rows?: number;
    softCharacterLimit?: number;
    errorMessage?: string;
}
export declare class TextField extends React.Component<TextFieldProps> {
    base: React.RefObject<HTMLDivElement>;
    constructor(props: TextFieldProps);
    onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>): void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export declare class SearchField extends TextField {
}
interface NumberFieldProps {
    label?: string;
    value: number | undefined;
    allowDecimal?: boolean;
    allowNegative?: boolean;
    onValue: (value: number | undefined) => void;
    onEnter?: () => void;
    onEscape?: () => void;
    placeholder?: string;
    title?: string;
    disabled?: boolean;
    helpText?: string;
}
interface NumberFieldState {
    /** The state of user input when not able to be parsed. Allows users to input intermediately un-parsable values */
    inputValue?: string;
}
export declare class NumberField extends React.Component<NumberFieldProps, NumberFieldState> {
    constructor(props: NumberFieldProps);
    render(): JSX.Element;
}
interface SelectFieldProps {
    label?: string;
    value: string | undefined;
    onValue: (value: string) => void;
    options: string[];
    optionLabels?: string[];
    helpText?: string;
    placeholder?: string;
}
export declare class SelectField extends React.Component<SelectFieldProps> {
    render(): JSX.Element;
}
interface Option {
    value: string;
    label?: string;
}
export interface SelectGroup {
    title: string;
    options: Option[];
}
interface SelectGroupsFieldProps {
    label?: string;
    value: string | undefined;
    onValue: (value: string) => void;
    options: Option[];
    groups: SelectGroup[];
    helpText?: string;
}
export declare class SelectGroupsField extends React.Component<SelectGroupsFieldProps> {
    render(): JSX.Element;
}
interface RadioGroupOption {
    label?: string;
    value: string;
}
interface RadioGroupProps {
    options: RadioGroupOption[];
    value?: string;
    onChange: (value: string) => void;
}
export declare class RadioGroup extends React.Component<RadioGroupProps> {
    render(): JSX.Element;
}
interface NumericSelectFieldProps {
    label?: string;
    value: number | undefined;
    onValue: (value: number) => void;
    options: number[];
    optionLabels?: string[];
    helpText?: string;
}
export declare class NumericSelectField extends React.Component<NumericSelectFieldProps> {
    render(): JSX.Element;
}
interface ToggleProps {
    label: string | JSX.Element;
    value: boolean;
    onValue: (value: boolean) => void;
    disabled?: boolean;
}
export declare class Toggle extends React.Component<ToggleProps> {
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export declare class EditableList extends React.Component<{
    className?: string;
}> {
    render(): JSX.Element | null;
}
export interface EditableListItemProps extends React.HTMLAttributes<HTMLLIElement> {
    className?: string;
}
export declare class EditableListItem extends React.Component<EditableListItemProps> {
    render(): JSX.Element;
}
export declare class ColorBox extends React.Component<{
    color: string | undefined;
    onColor: (color: string | undefined) => void;
}> {
    render(): JSX.Element;
}
export declare class Section extends React.Component<{
    name: string;
}> {
    render(): JSX.Element;
}
interface AutoTextFieldProps {
    label?: string;
    value: string | undefined;
    placeholder?: string;
    isAuto: boolean;
    helpText?: string;
    onValue: (value: string) => void;
    onToggleAuto: (value: boolean) => void;
    softCharacterLimit?: number;
    onBlur?: () => void;
}
export declare class AutoTextField extends React.Component<AutoTextFieldProps> {
    render(): JSX.Element;
}
export declare class BindString<T extends {
    [field: string]: any;
}, K extends keyof T> extends React.Component<{
    field: K;
    store: T;
    label?: string;
    placeholder?: string;
    helpText?: string;
    textarea?: boolean;
    softCharacterLimit?: number;
    disabled?: boolean;
    rows?: number;
    errorMessage?: string;
}> {
    onValue(value: string): void;
    render(): JSX.Element;
}
export declare class BindAutoString<T extends {
    [field: string]: any;
}, K extends keyof T> extends React.Component<{
    field: K;
    store: T;
    auto: string;
    label?: string;
    helpText?: string;
    softCharacterLimit?: number;
    onBlur?: () => void;
}> {
    onValue(value: string): void;
    onToggleAuto(value: boolean): void;
    render(): JSX.Element;
}
export declare class BindFloat<T extends {
    [field: string]: any;
}, K extends keyof T> extends React.Component<{
    field: K;
    store: T;
    label?: string;
    helpText?: string;
}> {
    onValue(value: number | undefined): void;
    render(): JSX.Element;
}
export declare class BindAutoFloat<T extends {
    [field: string]: any;
}, K extends keyof T> extends React.Component<{
    field: K;
    store: T;
    auto: number;
    label?: string;
    helpText?: string;
    onBlur?: () => void;
}> {
    onValue(value: number | undefined): void;
    onToggleAuto(value: boolean): void;
    render(): JSX.Element;
}
export declare class Modal extends React.Component<{
    className?: string;
    onClose: () => void;
}> {
    base: React.RefObject<HTMLDivElement>;
    dismissable: boolean;
    onClickOutside(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class LoadingBlocker extends React.Component {
    render(): JSX.Element;
}
export declare class Timeago extends React.Component<{
    time: Date;
}> {
    render(): string;
}
import { Tag } from "./TagBadge";
export declare class EditableTags extends React.Component<{
    tags: Tag[];
    suggestions: Tag[];
    onSave: (tags: Tag[]) => void;
    disabled?: boolean;
}> {
    isEditing: boolean;
    base: React.RefObject<HTMLDivElement>;
    tags: Tag[];
    onAddTag(tag: Tag): void;
    onRemoveTag(index: number): void;
    ensureUncategorized(): void;
    onToggleEdit(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export declare class Button extends React.Component<{
    children: any;
    onClick: () => void;
}> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Forms.d.ts.map