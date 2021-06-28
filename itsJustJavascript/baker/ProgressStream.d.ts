/// <reference types="node" />
import { WriteStream } from "tty";
export declare class ProgressStream implements Partial<WriteStream> {
    private wrappedStream;
    constructor(wrap: WriteStream);
    isTTY: boolean;
    private allWrites;
    replay(): void;
    write(buffer: string): boolean;
    cursorTo(index: number): boolean;
    clearLine(direction: 1): boolean;
    get columns(): number;
}
//# sourceMappingURL=ProgressStream.d.ts.map