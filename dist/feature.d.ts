import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Z } from '~/zs';
export declare namespace Feature {
    type SequenceItem = {
        part?: {
            type: Parts.PartType;
            value?: string;
        };
        feature?: {
            type: any;
            properties?: string[];
        };
        between?: {
            left: SequenceItem;
            right: SequenceItem;
        };
        or?: Sequence[];
        repeat?: Sequence;
        export?: string;
        required?: boolean;
    };
    type Sequence = SequenceItem[];
    class Feature<T> {
        sequence: Sequence;
        /**
         * Creates a new instance of the Feature class.
         * @param sequence The sequence of parts that make up the feature.
         */
        constructor(sequence: Sequence);
        /**
         * Creates a feature within the given scope and position.
         * @param data - The input data required for feature creation.
         * @param scope - The scope in which the feature is to be created.
         * @param position - The position context for error handling.
         * @returns An object containing the updated scope and optionally the exported data.
         */
        create(data: any, scope: Scope, position: Errors.Position): Feature.Return<T>;
        /**
         * Converts the given feature data into assembly text.
         * @param data The data to be converted into assembly text.
         * @param scope The scope in which the feature is being converted.
         * @returns The assembly text representation of the feature.
         */
        toAssemblyText(data: any, scope: Scope): string;
        /**
         * Converts the given feature data into assembly data.
         * @param data The data to be converted into assembly data.
         * @param scope The scope in which the feature is being converted.
         * @returns The assembly data representation of the feature.
         */
        toAssemblyData(data: any, scope: Scope): string;
        /**
         * Attempts to match the given parts against the feature sequence.
         * @param parts The parts to be matched against the feature sequence.
         * @param depth The current recursion depth. Used to prevent infinite recursion.
         * @returns An object containing the matched parts, the length of the matched parts, and any exported values.
         */
        match(parts: Parts.Part[], depth?: number): {
            parts: Parts.Part[];
            length: number;
            exports: Record<string, any>;
        } | null;
    }
    type Return<T> = {
        export: T;
        scope: Feature.Scope;
    };
    /**
     * Generate a unique identifier in the given scope.
     * The identifier is base62 and will be at least 64 characters long.
     * The identifier is composed of the following parts:
     * - the label of the scope
     * - the label of the parent scope (if any)
     * - the label of the parent scope (if any)
     * - ...
     * - the label of the current scope
     * - the label of the feature
     * - a base62 random number
     * The identifier is guaranteed to be unique among all features of the same type in the same scope.
     * @param label the label of the feature
     * @param scope the scope to generate the identifier in
     * @returns a unique identifier
     */
    function generateId(label: string, scope: Scope): string;
    class Scope {
        importer: Z.Importer;
        label: string;
        parent?: Scope | undefined;
        /**
         * Creates a new scope.
         * @param importer the importer of this scope
         * @param label the label of this scope
         * @param parent the parent scope (optional)
         */
        constructor(importer: Z.Importer, label: string, parent?: Scope | undefined);
        /**
         * Sets a value in the scope.
         * @param name the name of the value to set
         * @param value the value to set
         */
        set(name: string, value: any): void;
        /**
         * Gets a value from the scope.
         * @param name the name of the value to get
         * @returns the value associated with the given name
         */
        get(name: string): any;
        /**
         * Creates an alias in the scope.
         * @param name the name of the value to alias
         * @returns the id of the alias
         */
        alias(name: string): string;
        /**
         * Resolves an alias in the scope.
         * @param name the name of the alias to resolve
         * @returns the id of the resolved alias
         */
        resolve(name: string): any;
        /**
         * Flattens a path by joining it with a dot.
         * @param path the path to flatten
         * @returns the flattened path
         */
        flatten(path: string[]): string;
        /**
         * Generates a random numeric identifier.
         * @returns A string representation of a random numeric identifier.
         */
        generateRandomId(): string;
        /**
         * Adds a value to the return stack of the scope.
         * @param value The value to be added to the return stack.
         */
        pushReturn(value: any): void;
        _data: any;
        _alias: any;
        _return: any;
        id: string;
    }
}
