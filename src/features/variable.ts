import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { TypeRef } from '~/features/type';
import { Accessor } from '~/features/accessor';

type VariableData = {
	name: string,
	type: TypeRef,
	id: string
};

export class Variable extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'let' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'part': { 'type': Parts.PartType.COLON } },
			{ 'feature': { 'type': TypeRef }, 'export': 'type' },
			{
				'or': [
					[
						{ 'part': { 'type': Parts.PartType.EQUALS } },
						{ 'feature': { 'type': Accessor }, 'export': 'acessor'}
					]
				], 'export': 'declaration'
			}
		]);
	};

	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let variableData: VariableData = { } as VariableData;
		variableData.name = data.name;
		variableData.id = `var.${scope.alias(variableData.name)}`;
		console.log(variableData, data);

		return { scope, exports: variableData };
	};

	public toAssembly(variableData: VariableData, scope: Feature.Scope) {
		let content = `VAR ${variableData.id}\n`;
		
		
		return content;
	};
};
