import { Feature } from '~/feature';
import { Syntax } from '~/syntax';
import { Errors } from '~/error';
import { TypeRef } from '~/features/type';
import { PropertyData } from '~/features/accessor';
export type FunctionParameter = {
    name: string;
    type: TypeRef;
    id: string;
};
export type FunctionData = {
    name: string;
    parameters: FunctionParameter[];
    type: TypeRef;
    scope: Feature.Scope;
    body: Syntax.SyntaxData[];
    id: string;
};
export type FunctionCallParameterData = {
    value: PropertyData;
};
export type FunctionCallParametersData = {
    value: FunctionCallParameterData[];
};
export type FunctionCallData = {
    function: FunctionData;
    parameters: FunctionCallParametersData;
    id: string;
};
export declare class Function extends Feature.Feature<FunctionData> {
    constructor();
    static get(data: any, scope: Feature.Scope, position: Errors.Position): any;
    create: typeof Function.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: FunctionData;
    };
    toAssemblyText(functionData: FunctionData, scope: Feature.Scope): string;
}
export declare class FunctionCall extends Feature.Feature<FunctionCallData> {
    constructor();
    create: typeof FunctionCall.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<FunctionCallData>;
    toAssemblyText(callData: FunctionCallData, scope: Feature.Scope): string;
    toAssemblyData(callData: FunctionCallData, scope: Feature.Scope): string;
}
export declare class Return extends Feature.Feature<PropertyData> {
    constructor();
    create: typeof Return.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: PropertyData;
    };
    toAssemblyText(propertyData: PropertyData, scope: Feature.Scope): string;
}
