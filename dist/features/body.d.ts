import { Feature } from '~/feature';
import { Errors } from '~/error';
export type BodyData = {
    name: string;
    scope: Feature.Scope;
    id: string;
};
export declare class Body extends Feature.Feature<BodyData> {
    constructor();
    create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: BodyData;
    };
    toAssemblyText(bodyData: BodyData, scope: Feature.Scope): string;
}
