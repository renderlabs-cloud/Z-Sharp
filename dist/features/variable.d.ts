import { Feature } from '~/feature';
import { Errors } from '~/error';
import { TypeRefData } from '~/features/type';
import { PropertyData } from '~/features/accessor';
export type VariableData = {
    name: string;
    type: TypeRefData;
    id: string;
    declaration: PropertyData;
};
export declare class Variable extends Feature.Feature<VariableData> {
    constructor();
    static get(data: any, scope: Feature.Scope, position: Errors.Position, safe?: boolean): VariableData | undefined | never;
    create: typeof Variable.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<VariableData>;
    toAssemblyText(variableData: VariableData, scope: Feature.Scope): string;
    toAssemblyData(variableData: VariableData, scope: Feature.Scope): string;
}
