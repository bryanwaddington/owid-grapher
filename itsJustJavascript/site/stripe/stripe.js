"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stripe = window.Stripe;
const clientSettings_1 = require("../../settings/clientSettings");
const stripe = Stripe ? Stripe(clientSettings_1.STRIPE_PUBLIC_KEY) : undefined;
exports.default = stripe;
//# sourceMappingURL=stripe.js.map