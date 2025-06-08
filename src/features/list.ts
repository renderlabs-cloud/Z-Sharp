import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Util } from '~/util';

type ListData = {
	size: number
};

export class List extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_OPEN } },
			{
				'or': [
					[
						{ 'part': { 'type': Parts.PartType.NUMBER }, 'export': 'length', 'required': false }
					],
				]
			},
			{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_CLOSE } }
		]);
	};

	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let listData: ListData = { size: data.length };

		return { scope, export: listData };
	};
};
