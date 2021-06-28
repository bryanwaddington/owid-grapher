import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { OwidTable } from "../../coreTable/OwidTable";
export interface DownloadTabManager {
    idealBounds?: Bounds;
    staticSVG: string;
    displaySlug: string;
    baseUrl?: string;
    queryStr?: string;
    table?: OwidTable;
    externalCsvLink?: string;
}
interface DownloadTabProps {
    bounds?: Bounds;
    manager: DownloadTabManager;
}
export declare class DownloadTab extends React.Component<DownloadTabProps> {
    private get idealBounds();
    private get bounds();
    private get targetWidth();
    private get targetHeight();
    private get manager();
    private svgBlob?;
    private svgDownloadUrl?;
    private svgPreviewUrl?;
    private pngBlob?;
    private pngDownloadUrl?;
    private pngPreviewUrl?;
    private isReady;
    private export;
    private createSvg;
    private tryCreatePng;
    private markAsReady;
    private get fallbackPngUrl();
    private get baseFilename();
    private onPNGDownload;
    private onSVGDownload;
    private get inputTable();
    private onCsvDownload;
    private get csvButton();
    private renderReady;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=DownloadTab.d.ts.map