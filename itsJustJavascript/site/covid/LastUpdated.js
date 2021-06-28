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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastUpdated = void 0;
const react_1 = __importStar(require("react"));
const dayjs_1 = __importDefault(require("dayjs"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
dayjs_1.default.extend(relativeTime_1.default);
const LastUpdated = ({ timestampUrl }) => {
    const [date, setDate] = react_1.useState(null);
    react_1.useEffect(() => {
        const fetchTimeStamp = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!timestampUrl)
                return;
            const response = yield fetch(timestampUrl);
            if (!response.ok)
                return;
            const timestampRaw = yield response.text();
            const timestamp = timestampRaw.trim();
            const parsedDate = timestamp.length < 20
                ? dayjs_1.default(`${timestamp}Z`)
                : dayjs_1.default(timestamp);
            if (!parsedDate.isValid())
                return;
            setDate(parsedDate);
        });
        fetchTimeStamp();
    }, []);
    return (date && (react_1.default.createElement("span", null,
        "Last update: ",
        react_1.default.createElement("strong", null, date.fromNow()),
        ".")));
};
exports.LastUpdated = LastUpdated;
//# sourceMappingURL=LastUpdated.js.map