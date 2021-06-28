import { Grapher } from "../grapher/core/Grapher";
import { EditorFeatures } from "./EditorFeatures";
import { Admin } from "./Admin";
declare type EditorTab = string;
interface Variable {
    id: number;
    name: string;
}
export interface Dataset {
    name: string;
    namespace: string;
    variables: Variable[];
    isPrivate: boolean;
}
export interface Log {
    userId: number;
    userName: string;
    config: string;
    createdAt: string;
}
export interface PostReference {
    id: number;
    title: string;
    slug: string;
    url: string;
}
export interface ChartRedirect {
    id: number;
    slug: string;
    chartId: number;
}
export interface Namespace {
    name: string;
    description?: string;
    isArchived: boolean;
}
export interface NamespaceData {
    datasets: Dataset[];
}
export declare class EditorDatabase {
    namespaces: Namespace[];
    dataByNamespace: Map<string, NamespaceData>;
    constructor(json: any);
}
export interface ChartEditorManager {
    admin: Admin;
    grapher: Grapher;
    database: EditorDatabase;
    logs: Log[];
    references: PostReference[];
    redirects: ChartRedirect[];
}
export declare class ChartEditor {
    manager: ChartEditorManager;
    currentRequest: Promise<any> | undefined;
    tab: EditorTab;
    errorMessage?: {
        title: string;
        content: string;
    };
    previewMode: "mobile" | "desktop";
    savedGrapherJson: string;
    newChartId?: number;
    constructor(props: {
        manager: ChartEditorManager;
    });
    get isModified(): boolean;
    get grapher(): Grapher;
    get database(): EditorDatabase;
    get logs(): Log[];
    get references(): PostReference[];
    get redirects(): ChartRedirect[];
    get availableTabs(): EditorTab[];
    get isNewGrapher(): boolean;
    get features(): EditorFeatures;
    loadNamespace(namespace: string): Promise<void>;
    saveGrapher({ onError, }?: {
        onError?: () => void;
    }): Promise<void>;
    saveAsNewGrapher(): Promise<void>;
    publishGrapher(): void;
    unpublishGrapher(): void;
}
export {};
//# sourceMappingURL=ChartEditor.d.ts.map