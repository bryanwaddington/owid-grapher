/**
 * With our code residing either in some src folder or in the `itsJustJavascript` folder, it's not
 * always straightforward to know where to find a config file like `.env`.
 * Here, we just traverse the directory tree upwards until we find a `package.json` file, which
 * should indicate that we have found the root directory of the `owid-grapher` repo.
 */
export default function findProjectBaseDir(from: string): string | undefined;
//# sourceMappingURL=findBaseDir.d.ts.map