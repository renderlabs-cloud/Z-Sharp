import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Assembler } from '~/assembler';
import { Errors } from '~/error';
import { TypeRef, Type } from '~/features/type';
import { Accessor } from '~/features/accessor';
import { Body } from '~/features/body';

type FunctionParameter = {
	name: string,
	type: TypeRef,
	id: string
};

type FunctionData = {
	name: string,
	parameters: FunctionParameter[],
	type: TypeRef,
	scope: Feature.Scope,
	body: Syntax.SyntaxData[],
	id: string
};

export class Function extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'function' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'part': { 'type': Parts.PartType.PARENTHESIS_OPEN } },
			{ 'repeat': [
				{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
				{ 'part': { 'type': Parts.PartType.COLON } },
				{ 'feature': { 'type': TypeRef }, 'export': 'type' },
				{ 'part': { 'type': Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
			], 'export': 'parameters', required: false },
			{ 'part': { 'type': Parts.PartType.PARENTHESIS_CLOSE } },
			{ 'part': { 'type': Parts.PartType.COLON } },
			{ 'feature': { 'type': TypeRef }, 'export': 'type' },
			{ 'feature': { 'type': Body }, 'export': 'body' }
		]);
	};

	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let functionData: FunctionData = { } as FunctionData;
		functionData.name = data.name;
		functionData.id = `function.${scope.alias(functionData.name)}`;
		functionData.scope = new Feature.Scope(scope.importer, functionData.name, scope);
		functionData.type = data.type;
		functionData.parameters = data.parameters;
		
		const features = Syntax.toFeatures(data.body.parts, functionData.scope, position);
		functionData.body = features;

		console.log(functionData, data);
		scope.set(functionData.id, functionData);
		
		return { scope, exports: functionData };
	};

	public toAssembly(functionData: FunctionData, scope: Feature.Scope) {
		let content = `FUNC ${functionData.id}, PARAMS\n `;
		for (const parameter of functionData.parameters) {
			const type = Type.get(parameter.type, scope);
			parameter.id = functionData.scope.alias(parameter.name);
			console.log(parameter);
			content += `PARAM ${type.id}, ${parameter.id}\n`;
		};
		content += `PARAMS_END\n`;
		content += `${Assembler.assemble(functionData.body)}\nFUNC_END\n`;
		
		return content;
	};
};
