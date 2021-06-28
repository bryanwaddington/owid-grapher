#! /usr/bin/env jest
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
// This just does a sanity check that all the stories can mount.
// This file might not be necessary as there may be a way to do something similar with Storybook/Jest.
// For now, to get a list of all stories for updating this file:
// git ls-tree -r master --name-only | grep .stories.tsx | sed 's/.tsx//'
const StackedAreaChart = __importStar(require("./stackedCharts/StackedAreaChart.stories"));
const DiscreteBarChart = __importStar(require("./barCharts/DiscreteBarChart.stories"));
const CaptionedChart = __importStar(require("./captionedChart/CaptionedChart.stories"));
const NoDataModal = __importStar(require("./noDataModal/NoDataModal.stories"));
const CollapsibleList = __importStar(require("./controls/CollapsibleList/CollapsibleList.stories"));
const CommandPalette = __importStar(require("./controls/CommandPalette.stories"));
const EntityPicker = __importStar(require("./controls/entityPicker/EntityPicker.stories"));
const ScaleSelector = __importStar(require("./controls/ScaleSelector.stories"));
const GlobalEntitySelector = __importStar(require("./controls/globalEntitySelector/GlobalEntitySelector.stories"));
const Grapher = __importStar(require("./core/Grapher.stories"));
const DataTable = __importStar(require("./dataTable/DataTable.stories"));
const FacetChart = __importStar(require("./facetChart/FacetChart.stories"));
const Footer = __importStar(require("./footer/Footer.stories"));
const Header = __importStar(require("./header/Header.stories"));
const LineChart = __importStar(require("./lineCharts/LineChart.stories"));
const LoadingIndicator = __importStar(require("./loadingIndicator/LoadingIndicator.stories"));
const ScatterPlot = __importStar(require("./scatterCharts/ScatterPlotChart.stories"));
const SlopeChart = __importStar(require("./slopeCharts/SlopeChart.stories"));
const TimelineComponent = __importStar(require("./timeline/TimelineComponent.stories"));
const StackedBarChart = __importStar(require("./stackedCharts/StackedBarChart.stories"));
const DownloadTab = __importStar(require("./downloadTab/DownloadTab.stories"));
const LineLegend = __importStar(require("./lineLegend/LineLegend.stories"));
const MapChart = __importStar(require("./mapCharts/MapChart.stories"));
const MapTooltip = __importStar(require("./mapCharts/MapTooltip.stories"));
const Spreadsheet = __importStar(require("./spreadsheet/Spreadsheet.stories"));
const SourcesTab = __importStar(require("./sourcesTab/SourcesTab.stories"));
const VerticalColorLegend = __importStar(require("./verticalColorLegend/VerticalColorLegend.stories"));
const runTests = (storybook) => {
    const defaults = storybook.default;
    Object.keys(storybook).forEach((key) => {
        if (key === "default")
            return;
        describe(defaults.title, () => {
            const args = {};
            it(`should load ${key}`, () => {
                expect(enzyme_1.mount(storybook[key](args))).toBeTruthy();
            });
        });
    });
};
runTests(StackedAreaChart);
runTests(DiscreteBarChart);
runTests(CaptionedChart);
runTests(NoDataModal);
runTests(CollapsibleList);
runTests(CommandPalette);
runTests(EntityPicker);
runTests(ScaleSelector);
runTests(Grapher);
runTests(DataTable);
runTests(FacetChart);
runTests(Footer);
runTests(Header);
runTests(LineChart);
runTests(LoadingIndicator);
runTests(ScatterPlot);
runTests(SlopeChart);
runTests(TimelineComponent);
runTests(StackedBarChart);
runTests(DownloadTab);
runTests(LineLegend);
runTests(MapChart);
runTests(MapTooltip);
runTests(SourcesTab);
runTests(GlobalEntitySelector);
runTests(Spreadsheet);
runTests(VerticalColorLegend);
//# sourceMappingURL=stories.jsdom.test.js.map