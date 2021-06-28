#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Deployer_1 = require("./Deployer");
const DeployTarget_1 = require("./DeployTarget");
it("can init", () => {
    const deployer = new Deployer_1.Deployer({
        owidGrapherRootDir: __dirname + "/../",
        target: DeployTarget_1.DeployTarget.live,
        userRunningTheDeploy: "jane",
        skipChecks: true,
        runChecksRemotely: false,
    });
    expect(deployer.targetIsProd).toBeTruthy();
});
//# sourceMappingURL=Deployer.test.js.map