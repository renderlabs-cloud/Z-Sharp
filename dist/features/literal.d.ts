import { Feature } from '~/feature';
import { Errors } from '~/error';
import { PropertyData } from '~/features/accessor';
import { TypeRefData } from '~/features/type';
export type ObjectLiteralFieldData = {
    name: string;
    type: TypeRefData;
    value: PropertyData;
    id: string;
};
export type ObjectLiteralData = {
    fields: ObjectLiteralFieldData[];
    id: string;
};
export type StringLiteralData = {
    data: string;
    id: string;
    interpolated: boolean;
};
export declare function toPaddedBytes(data: string, tabs?: number, row?: number): string;
export declare class ObjectLiteral extends Feature.Feature<ObjectLiteralData> {
    constructor();
    create: typeof ObjectLiteral.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: ObjectLiteralData;
    };
    toAssemblyData(objectData: ObjectLiteralData, scope: Feature.Scope): string;
}
export declare class StringLiteral extends Feature.Feature<StringLiteralData> {
    constructor();
    create: typeof StringLiteral.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: StringLiteralData;
    };
    toAssemblyData(stringLiteralData: StringLiteralData, scope: Feature.Scope): string;
}
