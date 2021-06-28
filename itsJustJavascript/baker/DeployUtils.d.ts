export declare const tryBake: () => Promise<void>;
/**
 * Try to initiate a deploy and then terminate the baker, allowing a clean exit.
 * Used in CLI.
 */
export declare const tryDeploy: (message?: string | undefined, email?: string | undefined, name?: string | undefined) => Promise<void>;
/**
 * Initiate deploy if no other deploy is currently pending, and there are changes
 * in the queue.
 * If there is a deploy pending, another one will be automatically triggered at
 * the end of the current one, as long as there are changes in the queue.
 * If there are no changes in the queue, a deploy won't be initiated.
 */
export declare const deployIfQueueIsNotEmpty: () => Promise<void>;
//# sourceMappingURL=DeployUtils.d.ts.map