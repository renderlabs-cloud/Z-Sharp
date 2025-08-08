import { Feature } from '~/feature';
import { Errors } from '~/error';
import { TypeRefData } from '~/features/type';
export type ListTypeData = {
    size?: number;
    next?: TypeRefData;
};
export declare class List extends Feature.Feature<ListTypeData> {
    constructor();
    static create(data: any, scope: Feature.Scope, position: Errors.Position): {
        scope: Feature.Scope;
        export: ListTypeData;
    };
}
