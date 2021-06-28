import { GeoPath } from "d3-geo";
export declare enum MapProjectionName {
    World = "World",
    Africa = "Africa",
    NorthAmerica = "NorthAmerica",
    SouthAmerica = "SouthAmerica",
    Asia = "Asia",
    Europe = "Europe",
    Oceania = "Oceania"
}
export declare const MapProjectionLabels: Record<MapProjectionName, string>;
export declare const MapProjectionGeos: {
    [key in MapProjectionName]: GeoPath;
};
//# sourceMappingURL=MapProjections.d.ts.map