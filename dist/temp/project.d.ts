import Zod from 'zod';
import { Errors } from '~/error';
export declare namespace Project {
    const ConfigurationSchema: Zod.ZodObject<{
        Project: Zod.ZodOptional<Zod.ZodObject<{
            name: Zod.ZodOptional<Zod.ZodString>;
            version: Zod.ZodOptional<Zod.ZodTuple<[Zod.ZodNumber, Zod.ZodNumber, Zod.ZodNumber], null>>;
            description: Zod.ZodOptional<Zod.ZodString>;
            Author: Zod.ZodObject<{
                name: Zod.ZodUnion<readonly [Zod.ZodString, Zod.ZodArray<Zod.ZodString>]>;
            }, Zod.core.$strict>;
            Contributors: Zod.ZodObject<{
                names: Zod.ZodArray<Zod.ZodUnion<readonly [Zod.ZodString, Zod.ZodArray<Zod.ZodString>]>>;
            }, Zod.core.$strip>;
            repository: Zod.ZodOptional<Zod.ZodString>;
            license: Zod.ZodDefault<Zod.ZodString>;
        }, Zod.core.$strict>>;
        Mods: Zod.ZodOptional<Zod.ZodArray<Zod.ZodObject<{
            source: Zod.ZodString;
            config: Zod.ZodOptional<Zod.ZodString>;
        }, Zod.core.$strict>>>;
        base: Zod.ZodOptional<Zod.ZodString>;
    }, Zod.core.$strict>;
    type Configuration = Zod.infer<typeof ConfigurationSchema>;
    /**
     * Convert a Zod error into a {@link Errors.Project.Invalid} error.
     *
     * @param err - the Zod error to convert
     * @returns the converted error
     */
    function error(err: Zod.ZodError): Errors.Project.Invalid;
    /**
     * Validate a project configuration object.
     *
     * @param data - the object to validate
     * @returns a validated project configuration object
     * @throws {Project.Invalid} if the object is invalid
     */
    function validate(data: any): {
        Project?: {
            Author: {
                name: string | string[];
            };
            Contributors: {
                names: (string | string[])[];
            };
            license: string;
            name?: string | undefined;
            version?: [number, number, number] | undefined;
            description?: string | undefined;
            repository?: string | undefined;
        } | undefined;
        Mods?: {
            source: string;
            config?: string | undefined;
        }[] | undefined;
        base?: string | undefined;
    };
    /**
     * Creates a project configuration by validating the provided data.
     * @param data The data to be validated and used for creating the project configuration.
     * @returns The validated project configuration.
     */
    function create(data: any): {
        Project?: {
            Author: {
                name: string | string[];
            };
            Contributors: {
                names: (string | string[])[];
            };
            license: string;
            name?: string | undefined;
            version?: [number, number, number] | undefined;
            description?: string | undefined;
            repository?: string | undefined;
        } | undefined;
        Mods?: {
            source: string;
            config?: string | undefined;
        }[] | undefined;
        base?: string | undefined;
    };
    /**
     * Attempts to read the nearest .zsharp.toml file, which stores the project's configuration.
     * @param path The path to start searching from.
     * @returns The parsed project configuration, or an empty object if none could be found.
     */
    function get(path: string): Configuration;
}
