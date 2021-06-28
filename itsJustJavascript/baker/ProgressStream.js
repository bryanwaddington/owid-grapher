"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressStream = void 0;
// Wrap stderr before passing it to ProgressBar so we can save all writes
// and replay them at the end of the bake. Without this the progress bar class
// works fine, but there is no way to show the summary once the job is complete.
class ProgressStream {
    constructor(wrap) {
        this.isTTY = true;
        this.allWrites = [];
        this.wrappedStream = wrap;
    }
    replay() {
        console.log(this.allWrites.join(""));
    }
    write(buffer) {
        this.allWrites.push(buffer);
        return this.wrappedStream.write(buffer);
    }
    cursorTo(index) {
        return this.wrappedStream.cursorTo(index);
    }
    clearLine(direction) {
        return this.wrappedStream.clearLine(direction);
    }
    get columns() {
        return this.wrappedStream.columns;
    }
}
exports.ProgressStream = ProgressStream;
//# sourceMappingURL=ProgressStream.js.map