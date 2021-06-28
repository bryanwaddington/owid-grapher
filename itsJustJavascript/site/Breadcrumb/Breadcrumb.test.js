#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Breadcrumb_1 = require("./Breadcrumb");
const subnavs = {
    coronavirus: [
        { label: "Coronavirus", href: "/coronavirus", id: "coronavirus" },
        {
            label: "Excess mortality",
            href: "/excess-mortality-covid",
            id: "excess-mortality",
        },
        {
            label: "Policy responses",
            href: "/policy-responses-covid",
            id: "policy-responses",
            parentId: "excess-mortality",
        },
        {
            label: "Cancellation of Public Events",
            href: "/covid-cancel-public-events",
            id: "cancel-public-events",
            parentId: "policy-responses",
        },
    ],
};
describe("breadcrumb", () => {
    it("gets parent", () => {
        expect(Breadcrumb_1.getSubnavParent(Breadcrumb_1.getSubnavItem("cancel-public-events", subnavs["coronavirus"]), subnavs["coronavirus"])).toEqual(Breadcrumb_1.getSubnavItem("policy-responses", subnavs["coronavirus"]));
    });
    it("gets single level breadcrumb", () => {
        expect(Breadcrumb_1.getBreadcrumbItems("coronavirus", subnavs["coronavirus"])).toEqual([Breadcrumb_1.getSubnavItem("coronavirus", subnavs["coronavirus"])]);
    });
    it("gets multi level breadcrumb", () => {
        expect(Breadcrumb_1.getBreadcrumbItems("cancel-public-events", subnavs["coronavirus"])).toEqual([
            Breadcrumb_1.getSubnavItem("coronavirus", subnavs["coronavirus"]),
            Breadcrumb_1.getSubnavItem("excess-mortality", subnavs["coronavirus"]),
            Breadcrumb_1.getSubnavItem("policy-responses", subnavs["coronavirus"]),
            Breadcrumb_1.getSubnavItem("cancel-public-events", subnavs["coronavirus"]),
        ]);
    });
});
//# sourceMappingURL=Breadcrumb.test.js.map