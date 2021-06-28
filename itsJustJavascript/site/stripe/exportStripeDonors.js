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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const lodash_1 = require("lodash");
const serverSettings_1 = require("../../settings/serverSettings");
const Util_1 = require("../../clientUtils/Util");
const stripe = new stripe_1.default(serverSettings_1.STRIPE_SECRET_KEY, {
    apiVersion: "2020-03-02",
});
function getAll(getter) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = [];
        let firstRun = true;
        let startingAfter;
        while (firstRun || startingAfter) {
            const response = yield getter({
                limit: 100,
                starting_after: startingAfter,
            });
            result.push(...response.data);
            startingAfter =
                response.has_more && response.data.length > 0
                    ? response.data[response.data.length - 1].id
                    : undefined;
            firstRun = false;
        }
        return result;
    });
}
const getAllPaymentIntents = () => getAll(stripe.paymentIntents.list.bind(stripe.paymentIntents));
const getAllCustomers = () => getAll(stripe.customers.list.bind(stripe.customers));
function getCustomersWithPaymentIntents() {
    return __awaiter(this, void 0, void 0, function* () {
        const [paymentIntents, customers] = yield Promise.all([
            getAllPaymentIntents(),
            getAllCustomers(),
        ]);
        const successfulPaymentIntents = paymentIntents.filter((paymentIntent) => paymentIntent.status === "succeeded");
        const paymentIntentsByCustomerId = lodash_1.groupBy(successfulPaymentIntents, "customer");
        return customers
            .map((customer) => {
            const customerWithPaymentIntent = Object.assign(Object.assign({}, customer), { paymentIntents: paymentIntentsByCustomerId[customer.id] || [] });
            return customerWithPaymentIntent;
        })
            .filter((customer) => customer.paymentIntents.length > 0);
    });
}
function getDonors() {
    return __awaiter(this, void 0, void 0, function* () {
        const customers = yield getCustomersWithPaymentIntents();
        return customers.map((customer) => {
            var _a, _b, _c, _d;
            const metadata = Object.assign(Object.assign(Object.assign({}, customer.metadata), (_a = customer.paymentIntents[0]) === null || _a === void 0 ? void 0 : _a.metadata), (_c = (_b = customer.subscriptions) === null || _b === void 0 ? void 0 : _b.data[0]) === null || _c === void 0 ? void 0 : _c.metadata);
            return {
                email: customer.email,
                name: metadata === null || metadata === void 0 ? void 0 : metadata.name,
                showOnList: metadata === null || metadata === void 0 ? void 0 : metadata.showOnList,
                isMonthly: !!((_d = customer.subscriptions) === null || _d === void 0 ? void 0 : _d.data.length),
                created: new Date(customer.created * 1000).toISOString(),
                total: lodash_1.sum(customer.paymentIntents.map((pi) => pi.amount)) / 100,
            };
        });
    });
}
const toCSV = (headers, data) => [
    Util_1.arrToCsvRow(headers),
    ...data.map((json) => Util_1.arrToCsvRow(headers.map((header) => json[header]))),
].join(""); // csvRow() already adds newlines
function writeDonorsCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        const donors = yield getDonors();
        process.stdout.write(toCSV(["email", "name", "showOnList", "isMonthly", "total", "created"], donors));
    });
}
writeDonorsCSV();
//# sourceMappingURL=exportStripeDonors.js.map