import { Url } from "./Url";
export declare type UrlMigration = (url: Url) => Url;
export declare const performUrlMigrations: (migrations: UrlMigration[], url: Url) => Url;
//# sourceMappingURL=UrlMigration.d.ts.map