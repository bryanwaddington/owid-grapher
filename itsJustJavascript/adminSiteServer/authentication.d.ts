import * as express from "express";
import { User } from "../db/model/User";
export declare type CurrentUser = User;
export declare type Request = express.Request;
export interface Response extends express.Response {
    locals: {
        user: CurrentUser;
        session: Session;
    };
}
interface Session {
    id: string;
    expiryDate: Date;
}
export declare function authCloudflareSSOMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
export declare function logOut(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
export declare function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
export declare function logInWithCredentials(email: string, password: string): Promise<Session>;
export {};
//# sourceMappingURL=authentication.d.ts.map