import * as shell from "shelljs";
interface ExecReturn {
    code: number;
    stdout: string;
    stderr: string;
}
export declare class ExecError extends Error implements ExecReturn {
    code: number;
    stdout: string;
    stderr: string;
    constructor(props: ExecReturn);
}
export declare const execWrapper: (command: string, options?: shell.ExecOptions | undefined) => Promise<ExecReturn>;
export declare const execFormatted: (cmd: string, args: string[], verbose?: boolean) => Promise<ExecReturn>;
export {};
//# sourceMappingURL=execWrapper.d.ts.map