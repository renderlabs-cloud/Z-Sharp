import { Project } from '~/project';
export declare namespace Z {
    type ImportFunction = (path: string) => string;
    type Importer = {
        import: ImportFunction[];
        debug: boolean;
        cli: boolean;
        base: string;
    };
    /**
     * Compiles Z# code to assembly.
     *
     * @param content the content of the Z# file to compile
     * @param importer the importer object, used to import Z# modules
     * @param path the path of the Z# file to compile, if any
     * @returns the compiled Z# intermediate assembly
     */
    function toIZ(content: string, importer: Importer, config: Project.Configuration, path?: string): Promise<string>;
    /**
     * Emit the given Z# intermediate assembly into a binary file.
     *
     * @param content The Z# intermediate assembly source code.
     * @param output The output file path.
     *
     * @returns The compiled binary data.
     */
    function emit(content: string): Promise<Uint8Array<ArrayBufferLike>>;
}
