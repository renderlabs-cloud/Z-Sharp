import { Feature } from '~/feature';
import { Errors } from '~/error';
import { TypeRefData } from '~/features/type';
import { ObjectLiteralData, StringLiteralData } from '~/features/literal';
import { FunctionCallData } from '~/features/function';
export declare enum PropertyType {
    STRING = 0,
    OBJECT = 1,
    CALL = 2,
    REFERENCE = 3
}
export type PropertyData = {
    type: TypeRefData;
    value: {
        string?: StringLiteralData;
        object?: ObjectLiteralData;
        call?: FunctionCallData;
        reference?: PropertyData;
    };
    is: PropertyType;
    id: string;
    relid: string;
};
export type PropertyTypeData = NonNullable<PropertyData['value'][keyof PropertyData['value']]>;
export declare class Accessor extends Feature.Feature<PropertyData> {
    constructor();
    create: typeof Accessor.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<PropertyData>;
    toAssemblyText(propertyData: PropertyData, scope: Feature.Scope): string;
    toAssemblyData(propertyData: PropertyData, scope: Feature.Scope): string;
}
