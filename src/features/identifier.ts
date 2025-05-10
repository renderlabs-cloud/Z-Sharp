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
			{ 'repeat': [
				{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'property' },
				{ 'part': { 'type': Parts.PartType.COLON } },
				{ 'feature': { 'type': Identifier }, 'export': 'type' },
				{ 'part': { 'type': Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
			], 'export': 'location' }
		]);
	};
	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		return { scope, export: {
			location: data.location?.join('.')
		} };
	};
};
