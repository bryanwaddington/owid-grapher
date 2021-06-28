import { Router } from "express";
import { Request, Response } from "./authentication";
export declare class FunctionalRouter {
    router: Router;
    constructor();
    wrap(callback: (req: Request, res: Response) => Promise<any>): (req: Request, res: Response) => Promise<void>;
    get(targetPath: string, callback: (req: Request, res: Response) => Promise<any>): void;
    post(targetPath: string, callback: (req: Request, res: Response) => Promise<any>): void;
    put(targetPath: string, callback: (req: Request, res: Response) => Promise<any>): void;
    delete(targetPath: string, callback: (req: Request, res: Response) => Promise<any>): void;
}
//# sourceMappingURL=FunctionalRouter.d.ts.map