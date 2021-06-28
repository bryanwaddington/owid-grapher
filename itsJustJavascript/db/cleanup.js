"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExitHandler = exports.exit = exports.cleanup = void 0;
const handlers = [];
const cleanup = () => __awaiter(void 0, void 0, void 0, function* () { return yield Promise.all(handlers); });
exports.cleanup = cleanup;
const exit = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.cleanup();
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
exports.exit = exit;
const registerExitHandler = (fn) => handlers.push(fn);
exports.registerExitHandler = registerExitHandler;
process.on("SIGINT", exports.exit);
process.on("SIGTERM", exports.exit);
//# sourceMappingURL=cleanup.js.map