import { Feature } from "~/feature";
import { Parts } from "~/parts";
import { Errors } from "~/error";
import { Type, TypeRefData } from "~/features/type";

export type ObjectTypeData = {
	fields: TypeRefData[]
};

export class _Object extends Feature.Feature<any> {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
			// TODO: key: typeRef, value: typeRef
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
		])
	};
	public create = _Object.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<ObjectTypeData> {
		return { export: data, scope };
	};
};