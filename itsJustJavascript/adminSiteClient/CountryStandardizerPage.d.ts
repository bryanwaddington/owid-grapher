import * as React from "react";
import { IReactionDisposer } from "mobx";
import { AdminAppContextType } from "./AdminAppContext";
declare class CSV {
    filename?: string;
    rows: string[][];
    countryEntriesMap: Map<string, CountryEntry>;
    mapCountriesInputToOutput: {
        [key: string]: string | undefined;
    };
    autoMatchedCount: number;
    parseError?: string;
    findSimilarCountries: boolean;
    constructor();
    get allCountries(): string[];
    get countryColumnIndex(): number;
    get showDownloadOption(): boolean;
    get numCountries(): number;
    get validationError(): string | undefined;
    onFileUpload(filename: string, rows: string[][], err: any, similarityMatch: boolean): void;
    onFormatChange(countryMap: any, findSimilarCountries: boolean): void;
    parseCSV(): void;
}
interface CountryEntry extends React.HTMLAttributes<HTMLTableRowElement> {
    originalName: string;
    standardizedName?: string;
    approximatedMatches: string[];
    selectedMatch?: string;
    customName?: string;
}
export declare class CountryStandardizerPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    fileUploader: HTMLInputElement;
    countryList: CountryEntry[];
    inputFormat: string;
    outputFormat: string;
    csv: CSV;
    showAllRows: boolean;
    get shouldSaveSelection(): boolean;
    get displayMatchStatus(): JSX.Element;
    onInputFormat(format: string): void;
    onOutputFormat(format: string): void;
    onChooseCSV({ target }: {
        target: HTMLInputElement;
    }): void;
    dispose: IReactionDisposer;
    componentDidMount(): void;
    componentWillUnmount(): void;
    fetchCountryMap(): Promise<void>;
    get csvDataUri(): string;
    get csvFilename(): string;
    get downloadTooltip(): string;
    get fileUploadLabel(): string;
    get outputCSV(): Blob | undefined;
    onUpdateRow(value: string, inputCountry: string, isCustom: boolean): void;
    onDownload(ev: React.MouseEvent<HTMLAnchorElement>): void;
    onToggleRows(): void;
    onSave(): void;
    get entriesToShow(): CountryEntry[];
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=CountryStandardizerPage.d.ts.map