import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Assembler } from '~/assembler';
import { Util } from '~/util';
import { Errors } from '~/error';
import { TypeRef, Type, TypeRefData } from '~/features/type';
import { Accessor, PropertyData } from '~/features/accessor';
import { Body } from '~/features/body';
import { Identifier } from '~/features/identifier';
import { Variable, VariableData } from '~/features/variable';

export type FunctionParameter = {
	name: string,
	type: TypeRefData,
	id: string
};

export type FunctionData = {
	name: string,
	parameters: FunctionParameter[],
	type: TypeRefData,
	scope: Feature.Scope,
	body: Syntax.SyntaxData[],
	id: string
};

export type FunctionCallParameterData = {
	value: PropertyData
};

export type FunctionCallParametersData = {
	value: FunctionCallParameterData[],
};

export type FunctionCallData = {
	function: FunctionData,
	parameters: FunctionCallParametersData,
	id: string
};

export class Function extends Feature.Feature<FunctionData> {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'function' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'part': { 'type': Parts.PartType.PARENTHESIS_OPEN } },
			{
				'repeat': [
					{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
					{ 'part': { 'type': Parts.PartType.COLON } },
					{ 'feature': { 'type': TypeRef }, 'export': 'type' },
					{ 'part': { 'type': Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
				], 'export': 'parameters', required: false
			},
			{ 'part': { 'type': Parts.PartType.PARENTHESIS_CLOSE } },
			{ 'part': { 'type': Parts.PartType.COLON } },
			{ 'feature': { 'type': TypeRef }, 'export': 'type' },
			{ 'feature': { 'type': Body }, 'export': 'body' }
		]);
	};
	public static get(data: any, scope: Feature.Scope, position: Errors.Position): FunctionData | undefined | never {
		if (data.function) {
			const identifier = Identifier.create(data.function.declaration.reference, scope, position).export;
			const _function = scope.get(`function.${scope.resolve(scope.flatten(identifier.path))}`);
			if (!_function) {
				Util.error(new Errors.Syntax.Generic(`Function ${scope.flatten(identifier.path)} not defined`, position));
			};
			return _function;
		};
	};
	public create = Function.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let functionData: FunctionData = {} as FunctionData;
		functionData.name = data.name;
		functionData.id = scope.alias(functionData.name);
		functionData.scope = new Feature.Scope(scope.importer, functionData.name, scope);
		functionData.type = Type.get(data.type, scope, position) ?? {};
		functionData.parameters = [];

		for (const parameter of data.parameters) {
			const type = Type.get(parameter.type, scope, position);
			parameter.id = functionData.scope.alias(parameter.name);
			functionData.parameters.push({ name: parameter.name, type: type ?? {}, id: parameter.id });
		};

		const features = Syntax.toFeatures(data.body.parts, functionData.scope, position);
		functionData.body = features;
		scope.set(`function.${functionData.id}`, functionData);

		return { scope, export: functionData };
	};

	public async toAssemblyText(functionData: FunctionData, scope: Feature.Scope) {
		let content = `
/* Function ${functionData.name} */\nFUNC ${functionData.id}, PARAMS
		`;
		for (const parameter of functionData.parameters) {
			parameter.id = functionData.scope.alias(parameter.name);
			content += `
PARAM ${parameter.type.id}, ${parameter.id}
			`;
		};
		content += `
PARAMS_END
		`;
		content += `
${await Assembler.assemble(functionData.body, functionData.scope, {})}
FUNC_END
		`;

		return content;
	};
};

export class FunctionCall extends Feature.Feature<FunctionCallData> {
	constructor() {
		super([
			{ 'feature': { 'type': Accessor }, 'export': 'function' },
			{ 'part': { 'type': Parts.PartType.QUESTION }, 'export': 'ternary', 'required': false },
			{ 'part': { 'type': Parts.PartType.PARENTHESIS_OPEN } },
			{
				'repeat': [
					{ 'feature': { 'type': Accessor }, 'export': 'accessor' },
					{ 'part': { 'type': Parts.PartType.COMMA }, 'export': 'comma', 'required': false }
				], 'required': false, 'export': 'parameters'
			},
			{ 'part': { 'type': Parts.PartType.PARENTHESIS_CLOSE } }
		]);
	};
	public create = FunctionCall.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<FunctionCallData> {
		const callData = { parameters: {} } as FunctionCallData;
		const _function: FunctionData = Function.get(data, scope, position) || {} as FunctionData;

		callData.function = _function;
		callData.parameters.value = [];
		callData.id = scope.alias(scope.generateRandomId());

		let i = 0;
		for (const parameter of data.parameters) {
			const _variable = Variable.get(parameter, scope, position) ?? {} as VariableData;
			const accessor = _variable.declaration;
			callData.parameters.value.push({ value: accessor });
			if (!Type.isCompatible(_function.parameters[i].type, accessor.type)) {
				Util.error(new Errors.Syntax.Generic(`Parameter ${i + 1} of type ${Type.toString(accessor.type)} is not compatible with type ${Type.toString(_function.parameters[i].type)}`, position));
			};
			i++;
		};

		scope.set(`function_call_parameters.${callData.id}`, callData);

		return { scope: scope, export: callData };
	};
	public toAssemblyText(callData: FunctionCallData, scope: Feature.Scope) {
		let content = `
/* Function call ${callData.function.name} */
MOV (Z7, ${callData.id})
MOV (Z6, ${callData.function.id})
CALL (Z6)
		`;

		return content;
	};
	public toAssemblyData(callData: FunctionCallData, scope: Feature.Scope) {
		let content = `
${callData.id}:
		`;
		for (const parameter of callData.parameters.value) {
			content += `
	.quad ${parameter.value.id}
			`;
		};

		return content;
	};
};

export class Return extends Feature.Feature<PropertyData> {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'return' } },
			{ 'feature': { 'type': Accessor }, 'export': 'value' }
		]);
	};
	public create = Return.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const accessor = Accessor.create(data.value, scope, position);
		return { scope, export: accessor.export };
	};
	public toAssemblyText(propertyData: PropertyData, scope: Feature.Scope) {
		scope.pushReturn(propertyData);
		return `
RETURN ${propertyData.id}
		`;
	};
};