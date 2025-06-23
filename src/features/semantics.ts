import { Feature } from '~/feature';
import { Parts } from '~/parts';

export class Semicolon extends Feature.Feature<undefined> {
	constructor() {
		super([
			{ part: { type: Parts.PartType.SEMICOLON } }
		]);
	};
};
