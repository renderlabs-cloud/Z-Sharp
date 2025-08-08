import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { TypeRef, TypeRefData } from '~/features/type';
import { Util } from '~/util';

export type ListTypeData = {
	size?: number,
	next?: TypeRefData
};

export class List extends Feature.Feature<ListTypeData> {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_OPEN } },
			{
				'or': [
					[
						{ 'part': { 'type': Parts.PartType.NUMBER }, 'export': 'length', 'required': false }
					],
				],
				'export': 'list'
			},
			{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_CLOSE } }
		]);
	};

	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let listData: ListTypeData = { size: data.list?.length || null };

		return { scope, export: listData };
	};
};
