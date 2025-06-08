import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';

type BodyData = {
	name: string,
	scope: Feature.Scope,
	id: string
};

export class Body extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
			{
				'between': {
					'left': { 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
					'right': { 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } },
				}, 'export': 'parts'
			},
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
		]);
	};

	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let bodyData: BodyData = {} as BodyData;

		return { scope, export: bodyData };
	};

	public toAssemblyText(bodyData: BodyData, scope: Feature.Scope) {
		let content = ``;

		return content;
	};
};
