import { Feature } from '~/feature';
import { Errors } from '~/error';
import { PropertyData } from '~/features/accessor';
import { FunctionData } from '~/features/function';
import { ListTypeData } from '~/features/list';
type TypeField = {
    name: string;
    type: TypeRef;
    comma: boolean;
    id: string;
};
type TypeFields = {
    name?: string;
    fields?: TypeField[];
    id?: string;
};
type TypeRefBuildPart = TypeRefData | '|' | '&';
export type TypeRefData = {
    name?: string;
    generic?: TypeRefData[];
    build?: TypeRefBuildPart[];
    fields?: TypeFields;
    list?: ListTypeData;
    class?: {
        extends: TypeRefData[];
        implements: TypeRefData[];
        properties: PropertyData[];
        methods: FunctionData[];
    };
    id?: string;
};
export declare class Type extends Feature.Feature<TypeRefData> {
    constructor();
    static get(data: any, scope: Feature.Scope): TypeRefData | null;
    static toString(type: TypeRefData): string;
    static isCompatible(type1: TypeRefData, type2: TypeRefData): boolean;
    static incompatible(type1: TypeRefData, type2: TypeRefData, position: Errors.Position): never;
    create: typeof Type.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<TypeRefData>;
    toAssemblyText(typeData: TypeRefData, scope: Feature.Scope): string;
}
export declare class TypeRef extends Feature.Feature<TypeRefData> {
    constructor();
    create: typeof TypeRef.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: TypeRefData;
    };
}
export {};
