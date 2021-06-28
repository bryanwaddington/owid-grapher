export declare class BCryptHasher {
    private algorithm;
    private iterations;
    private salt;
    encode(password: string): Promise<string>;
    verify(password: string, hashToken: string): Promise<boolean>;
}
//# sourceMappingURL=hashers.d.ts.map