import { EntityName } from "../../coreTable/OwidTableConstants";
import { Url } from "../../clientUtils/urls/Url";
import { UrlMigration } from "../../clientUtils/urls/UrlMigration";
export declare const ENTITY_V2_DELIMITER = "~";
export declare const migrateSelectedEntityNamesParam: UrlMigration;
export declare const getSelectedEntityNamesParam: (url: Url) => EntityName[] | undefined;
export declare const setSelectedEntityNamesParam: (url: Url, entityNames: EntityName[] | undefined) => Url;
//# sourceMappingURL=EntityUrlBuilder.d.ts.map