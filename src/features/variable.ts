import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { TypeRef, Type, TypeRefData } from '~/features/type';
import { Accessor, PropertyData } from '~/features/accessor';
import { ObjectLiteral } from '~/features/literal';
import { Util } from '~/util';

type VariableData = {
	name: string,
	type: TypeRefData,
	id: string,
	declaration: PropertyData
};

export class Variable extends Feature.Feature<VariableData> {
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
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<VariableData> {
		if (scope.get(`var.${data.name}`)) {
			throw new Errors.Syntax.Duplicate(data.name, position);
		};
		let variableData: VariableData = {} as VariableData;
		variableData.name = data.name;
		variableData.id = scope.alias(variableData.name);
		variableData.type = new TypeRef().create(data.type, scope, position).export;
		variableData.declaration = new Accessor().create(data.declaration, scope, position).export;
		Util.debug(`Variable ${variableData.name} created`, variableData);
		if (!Type.isCompatible(variableData.type, variableData.declaration.type)) {
			Type.incompatible(variableData.type, variableData.declaration.type, position);
		};
		scope.set(`var.${variableData.id}`, variableData);

		return { scope, export: variableData };
	};

	public toAssemblyText(variableData: VariableData, scope: Feature.Scope) {
		let variable = new Accessor();
		let definition = `
${variable.toAssemblyText(variableData.declaration, scope)}
		`;
		let content = `
/* Variable ${variableData.name} */
${definition}
VAR ${variableData.id}, RDI, RDI
SCOPE SET ${variableData.id}, RDI
		`;

		return content;
	};

	public toAssemblyData(variableData: VariableData, scope: Feature.Scope) {
		let content = ``;
		content += new Accessor().toAssemblyData(variableData.declaration, scope);

		return content;
	}
};
