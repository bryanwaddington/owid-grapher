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
exports.publicApiRouter = void 0;
const FunctionalRouter_1 = require("./FunctionalRouter");
const Variable_1 = require("../db/model/Variable");
const serverUtil_1 = require("./serverUtil");
exports.publicApiRouter = new FunctionalRouter_1.FunctionalRouter();
exports.publicApiRouter.router.get("/variables/:variableIds.csv", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const variableIds = req.params.variableIds.split("+").map(serverUtil_1.expectInt);
    try {
        yield Variable_1.writeVariableCSV(variableIds, res);
        res.end();
    }
    catch (error) {
        res.send(`Error: ${error.message}`);
    }
}));
//# sourceMappingURL=publicApiRouter.js.map