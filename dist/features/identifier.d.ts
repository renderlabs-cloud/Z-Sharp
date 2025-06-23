import { Feature } from '~/feature';
import { Errors } from '~/error';
export type IdentifierData = {
    location: string[];
    base: string;
    path: string[];
};
export declare class Identifier extends Feature.Feature<IdentifierData> {
    constructor();
    create: typeof Identifier.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: IdentifierData;
    };
}
