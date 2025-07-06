import { Feature } from "~/feature";
import { Errors } from "~/error";
import { TypeRefData } from "~/features/type";
export type ObjectTypeData = {
    fields: TypeRefData[];
};
export declare class _Object extends Feature.Feature<any> {
    constructor();
    create: typeof _Object.create;
    static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<ObjectTypeData>;
}
