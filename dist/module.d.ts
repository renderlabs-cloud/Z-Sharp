import Zod from 'zod';
export declare namespace Module {
    const ConfigurationSchema: Zod.ZodObject<{
        name: Zod.ZodString;
        description: Zod.ZodOptional<Zod.ZodString>;
        version: Zod.ZodTuple<[Zod.ZodNumber, Zod.ZodNumber, Zod.ZodNumber], null>;
        source: Zod.ZodString;
        configuration: Zod.ZodOptional<Zod.ZodString>;
    }, "strict", Zod.ZodTypeAny, {
        name: string;
        version: [number, number, number];
        source: string;
        description?: string | undefined;
        configuration?: string | undefined;
    }, {
        name: string;
        version: [number, number, number];
        source: string;
        description?: string | undefined;
        configuration?: string | undefined;
    }>;
    type Configuration = Zod.infer<typeof ConfigurationSchema>;
    /**
     * Reads and parses a module configuration file from the specified path.
     *
     * @param path - The path to the module configuration file.
     * @returns The parsed module configuration.
     * @throws {Errors.Project.Invalid} If the file content is invalid.
     */
    function get(_path: string, projectPath: string): {
        implements: {
            features?: any[] | undefined;
            importer?: ((args_0: any, ...args: unknown[]) => string) | undefined;
        };
    } | null;
}
