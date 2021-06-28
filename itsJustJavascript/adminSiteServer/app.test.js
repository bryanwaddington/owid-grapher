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
const app_1 = require("./app");
jest.setTimeout(10000); // wait for up to 10s for the app server to start
describe(app_1.OwidAdminApp, () => {
    const app = new app_1.OwidAdminApp({ isDev: true, gitCmsDir: "", quiet: true });
    it("should be able to create an app", () => {
        expect(app).toBeTruthy();
    });
    it("should be able to start the app", () => __awaiter(void 0, void 0, void 0, function* () {
        yield app.startListening(8765, "localhost");
        expect(app.server).toBeTruthy();
        app.stopListening();
    }));
});
//# sourceMappingURL=app.test.js.map