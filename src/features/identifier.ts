import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';

type IdentifierData = {
	location?: string,
	ref?: string
};

export class Identifier extends Feature.Feature {
	constructor() {
		super([ 
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'repeat': [
				{ 'part': { 'type': Parts.PartType.PERIOD } },
				{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'property' },
			], 'export': 'location' }
		]);
	};
	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		return { scope, export: {
			location: data.location?.join('.')
		} };
	};
};
