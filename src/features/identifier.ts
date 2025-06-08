import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';

export type IdentifierData = {
	location: string[],
	base: string,
	path: string[]
};

export class Identifier extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'base' },
			{
				'repeat': [
					{ 'part': { 'type': Parts.PartType.PERIOD } },
					{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'property' },
				], 'export': 'location', 'required': false
			}
		]);
	};
	public create = Identifier.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const identifierData = {} as IdentifierData;
		identifierData.base = data.base;
		identifierData.location = data.location?.map((v: any) => { return v.property });
		identifierData.path = [identifierData.base, ...(identifierData.location || [])];
		return { scope, export: identifierData };
	};
};