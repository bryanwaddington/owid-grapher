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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const AdminLayout_1 = require("./AdminLayout");
const Link_1 = require("./Link");
const AdminAppContext_1 = require("./AdminAppContext");
let TestIndexPage = class TestIndexPage extends React.Component {
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Test" },
            React.createElement("main", { className: "TestIndexPage" },
                React.createElement("h2", null, "Test Embeds"),
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds" }, "All Charts")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: `/test/embeds?random=true` }, "Random Page of Charts")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=ChoroplethMap" }, "Choropleth Map")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=LineChart" }, "Line Chart")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=SlopeChart" }, "Slope Chart")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=DiscreteBar" }, "Discrete Bar")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=ScatterPlot" }, "Scatter Plot")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=StackedArea" }, "Stacked Area")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=StackedBar" }, "Stacked Bar")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?type=StackedDiscreteBar" }, "Stacked Discrete Bar")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?logLinear=true" }, "All charts with log scale switches")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?comparisonLines=true" }, "All charts with comparison lines")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?categoricalLegend=true" }, "All charts with categorical legends")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?stackMode=true" }, "All charts with relative stack mode")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embeds?relativeToggle=true" }, "All charts with relative toggles")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, target: "_blank", to: "/test/embedVariants" }, "Embed Variants")),
                    React.createElement("li", null,
                        React.createElement(Link_1.Link, { native: true, to: "/test/compareSvgs" }, "View changed SVGs"))))));
    }
};
TestIndexPage.contextType = AdminAppContext_1.AdminAppContext;
TestIndexPage = __decorate([
    mobx_react_1.observer
], TestIndexPage);
exports.TestIndexPage = TestIndexPage;
//# sourceMappingURL=TestIndexPage.js.map