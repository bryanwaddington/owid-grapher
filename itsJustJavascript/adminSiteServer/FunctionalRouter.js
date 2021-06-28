"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.FunctionalRouter = void 0;
const express = __importStar(require("express"));
const express_1 = require("express");
// Little wrapper to automatically send returned objects as JSON, makes
// the API code a bit cleaner
class FunctionalRouter {
    constructor() {
        this.router = express_1.Router();
        this.router.use(express.urlencoded({ extended: true }));
        // Parse incoming requests with JSON payloads http://expressjs.com/en/api.html
        this.router.use(express.json({ limit: "50mb" }));
    }
    wrap(callback) {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield callback(req, res));
        });
    }
    get(targetPath, callback) {
        this.router.get(targetPath, this.wrap(callback));
    }
    post(targetPath, callback) {
        this.router.post(targetPath, this.wrap(callback));
    }
    put(targetPath, callback) {
        this.router.put(targetPath, this.wrap(callback));
    }
    delete(targetPath, callback) {
        this.router.delete(targetPath, this.wrap(callback));
    }
}
exports.FunctionalRouter = FunctionalRouter;
//# sourceMappingURL=FunctionalRouter.js.map