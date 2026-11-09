/**
 * Lets plain Node run the app's TypeScript modules from a CLI script, without
 * a bundler or an extra dependency. Loaded with `node --import`; it resolves:
 * - the `@/` path alias (tsconfig) to `src/`;
 * - extensionless project imports (`./slug`) to their `.ts`/`.tsx`/index file.
 * Only project files get the extension fallback; node_modules resolve as usual.
 */
import { registerHooks, type ResolveFnOutput, type ResolveHookContext } from "node:module";

const PROJECT_ROOT = new URL("../../", import.meta.url).href;
const SRC_ROOT = new URL("src/", PROJECT_ROOT).href;
const NODE_MODULES = new URL("node_modules/", PROJECT_ROOT).href;
const ALIAS = "@/";
const SUFFIXES = ["", ".ts", ".tsx", "/index.ts"];
const RETRYABLE = new Set(["ERR_MODULE_NOT_FOUND", "ERR_UNSUPPORTED_DIR_IMPORT"]);

type NextResolve = (specifier: string, context?: Partial<ResolveHookContext>) => ResolveFnOutput;

const isRelative = (specifier: string) => specifier.startsWith("./") || specifier.startsWith("../");
const isProjectFile = (url: string | undefined) => !!url && url.startsWith(PROJECT_ROOT) && !url.startsWith(NODE_MODULES);
const errorCode = (err: unknown) => (err instanceof Error && "code" in err ? String(err.code) : "");

function resolveWithSuffixes(target: string, context: ResolveHookContext, nextResolve: NextResolve): ResolveFnOutput {
  let lastError: unknown;
  for (const suffix of SUFFIXES) {
    try {
      return nextResolve(target + suffix, context);
    } catch (err) {
      if (!RETRYABLE.has(errorCode(err))) throw err;
      lastError = err;
    }
  }
  throw lastError;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(ALIAS)) {
      return resolveWithSuffixes(new URL(specifier.slice(ALIAS.length), SRC_ROOT).href, context, nextResolve);
    }
    if (isRelative(specifier) && isProjectFile(context.parentURL)) {
      return resolveWithSuffixes(specifier, context, nextResolve);
    }
    return nextResolve(specifier, context);
  },
});
