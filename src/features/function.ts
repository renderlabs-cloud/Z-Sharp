import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Assembler } from '~/assembler';
import { Util } from '~/util';
import { Errors } from '~/error';
import { TypeRef, Type } from '~/features/type';
import { Accessor, PropertyData } from '~/features/accessor';
import { Body } from '~/features/body';
import { Identifier } from '~/features/identifier';

export type FunctionParameter = {
	name: string,
	type: TypeRef,
	id: string
};

export type FunctionData = {
	name: string,
	parameters: FunctionParameter[],
	type: TypeRef,
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
	public static get(data: any, scope: Feature.Scope, position: Errors.Position) {
		if (data.function) {
			// Update !!!
			const functionData = Identifier.create(data.function.declaration.reference, scope, position).export;
			const _function = scope.get(`function.${scope.resolve(scope.flatten(functionData.path))}`);
			return _function;
		};
	};
	public create = Function.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let functionData: FunctionData = {} as FunctionData;
		functionData.name = data.name;
		functionData.id = scope.alias(functionData.name);
		functionData.scope = new Feature.Scope(scope.importer, functionData.name, scope);
		functionData.type = data.type;
		functionData.parameters = data.parameters;

		const features = Syntax.toFeatures(data.body.parts, functionData.scope, position);
		functionData.body = features;
		scope.set(`function.${functionData.id}`, functionData);

		return { scope, export: functionData };
	};

	public toAssemblyText(functionData: FunctionData, scope: Feature.Scope) {
		let content = `
/* Function ${functionData.name} */\nFUNC ${functionData.id}, PARAMS
		`;
		for (const parameter of functionData.parameters) {
			const type = Type.get(parameter.type, scope);
			parameter.id = functionData.scope.alias(parameter.name);
			content += `
PARAM ${type?.id}, ${parameter.id}
			`;
		};
		content += `
PARAMS_END
		`;
		content += `
${Assembler.assemble(functionData.body, functionData.scope, {})}
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
		const _function: FunctionData = Function.get(data, scope, position);
		callData.function = _function;
		callData.parameters.value = data.parameters;
		callData.id = scope.alias(scope.generateRandomId());

		scope.set(`function_call_parameters.${callData.id}`, callData);

		return { scope: scope, export: callData };
	};
	public toAssemblyText(callData: FunctionCallData, scope: Feature.Scope) {
		let content = `
MOV R8, ${callData.function.id}
MOV R7, ${callData.id}
CALL R8
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