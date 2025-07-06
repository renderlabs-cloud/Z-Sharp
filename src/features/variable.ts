import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { TypeRef, Type, TypeRefData } from '~/features/type';
import { Accessor, PropertyData } from '~/features/accessor';
import { ObjectLiteral } from '~/features/literal';
import { Header } from '~/cli/header';
import { Util } from '~/util';
import { IfStatement } from 'typescript';

export type VariableData = {
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
	public static get(data: any, scope: Feature.Scope, position: Errors.Position, safe?: boolean): VariableData | undefined | never {
		if (data.accessor) {
			const identifier = Identifier.create(data.accessor.declaration.reference, scope, position).export;
			let id = scope.resolve(scope.flatten(identifier.path));
			let _variable = scope.get(`var.${id}`);

			if (!_variable && !safe) {
				Util.error(new Errors.Syntax.Generic(`Variable ${Header.quote(scope.flatten(identifier.path))} not defined`, position));
			};
			return _variable;
		};
	};
	public create = Variable.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<VariableData> {
		if (scope.get(`var.${data.id}`)) {
			Util.error(new Errors.Syntax.Duplicate(data.name, position));
		};
		let variableData: VariableData = {} as VariableData;

		variableData.name = data.name;
		variableData.id = scope.alias(variableData.name);
		variableData.type = new TypeRef().create(data.type, scope, position).export;
		variableData.declaration = new Accessor().create(data.declaration, scope, position).export;

		scope.set(`var.${variableData.id}`, variableData);

		return { scope, export: variableData };
	};

	public toAssemblyText(variableData: VariableData, scope: Feature.Scope) {
		let content = `
/* Variable ${variableData.name} */
${(new Accessor).toAssemblyText(variableData.declaration, scope)}
VAR ${variableData.id}, Z8, Z8
SCOPE_SET ${variableData.id}, Z8
		`;

		return content;
	};

	public toAssemblyData(variableData: VariableData, scope: Feature.Scope) {
		let content = ``;
		if (scope._asm_data[variableData.declaration.relid]) {
			return '';
		};

		content += new Accessor().toAssemblyData(variableData.declaration, scope);
		scope._asm_data[variableData.declaration.relid] = true;

		return content;
	}
};
