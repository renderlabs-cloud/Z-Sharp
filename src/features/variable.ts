import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { TypeRef } from '~/features/type';
import { Accessor, PropertyData } from '~/features/accessor';
import { ObjectLiteral } from '~/features/literal';
import { Util } from '~/util';

type VariableData = {
	name: string,
	type: TypeRef,
	id: string,
	declaration: PropertyData
};

export class Variable extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'let' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'part': { 'type': Parts.PartType.COLON } },
			{ 'feature': { 'type': TypeRef }, 'export': 'type' },
			{ 'part': { 'type': Parts.PartType.EQUALS }, 'export': 'equals', required: false },
			{ 'feature': { 'type': Accessor }, 'export': 'declaration' },
		]);
	};
	public create = Variable.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let variableData: VariableData = {} as VariableData;
		variableData.name = data.name;
		variableData.id = scope.alias(variableData.name);
		variableData.type = data.type;
		variableData.declaration = new Accessor().create(data.declaration, scope, position).export;
		scope.set(`var.${variableData.id}`, variableData);

		return { scope, export: variableData };
	};

	public toAssemblyText(variableData: VariableData, scope: Feature.Scope) {
		let variable = new Accessor();
		let definition = `
		${variable.toAssemblyText(variableData.declaration, scope)}
		`;
		console.log(variableData.declaration, variable);
		let content = `
/* Variable ${variableData.name} */
${definition}
VAR ${variableData.id}, RDI, RDI
		`;

		return content;
	};

	public toAssemblyData(variableData: VariableData, scope: Feature.Scope) {
		let content = ``;
		content += new Accessor().toAssemblyData(variableData.declaration, scope);

		return content;
	}
};
