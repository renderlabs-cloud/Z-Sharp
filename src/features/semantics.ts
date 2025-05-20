import { Feature } from '~/feature';
import { Parts } from '~/parts';

export class Semicolon extends Feature.Feature {
	constructor() {
		super([
			{ part: { type: Parts.PartType.SEMICOLON }}
		]);
	};
};
