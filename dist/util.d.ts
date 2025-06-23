import { Errors } from '~/error';
export declare namespace Util {
    /**
     * Trim an object down to a certain depth by recursively replacing children with `null` once a certain depth is reached.
     *
     * @param obj The object to trim.
     * @param maxDepth The maximum depth to trim to.
     * @param currentDepth The current depth of the object. Defaults to 0.
     *
     * @returns The trimmed object, or `null` if the object is too deep.
     */
    function trimDepth<T>(obj: T, maxDepth: number, currentDepth?: number): T | null;
    /**
     * Replaces all instances of `~` in the given path with the actual home directory
     * as determined by the `os.homedir()` function.
     *
     * @param path The path to be modified.
     *
     * @returns The modified path.
     */
    function OSPath(path: string): string;
    /**
     * Replaces backslashes with forward slashes and all instances of `@` with
     * `~/.zsharp/modules/` in the given path.
     *
     * @param path The path to be modified.
     *
     * @returns The modified path.
     */
    function modPath(path: string): string;
    function runInWorker<T, R>(func: (...args: any) => Promise<R>, ...args: any): Promise<R>;
    /**
     * Logs the error message, stack trace, and failure details, then exits the process.
     *
     * @param err An instance of `Errors.MainError` containing the error details to be logged.
     */
    function error(err: Errors.MainError): never;
    /**
     * Logs debug information for the provided arguments, including a stack trace.
     *
     * @param args A list of arguments to be logged as debug information.
     */
    function debug(...args: any[]): void;
    /**
     * Logs the provided arguments.
     *
     * @param args A list of arguments to be logged.
     */
    function log(...args: any[]): void;
}
