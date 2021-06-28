import * as React from "react";
export declare class EmbedChart extends React.Component<{
    src: string;
}> {
    private get url();
    private get configUrl();
    private get queryStr();
    private grapher?;
    private loadConfig;
    private dispose?;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=EmbedChart.d.ts.map