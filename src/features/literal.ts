import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Accessor, PropertyData } from '~/features/accessor';

export type ObjectLiteralFieldData = {
	name: string,
	value: PropertyData
};

export type ObjectLiteralData = {
	fields: ObjectLiteralFieldData[],
	id: string
};

export type StringLiteralData = {
	data: string,
	id: string,
	interpolated: boolean
};

export class ObjectLiteral extends Feature.Feature<ObjectLiteralData> {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
			{
				'repeat': [
					{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
					{ 'part': { 'type': Parts.PartType.COLON } },
					{ 'feature': { 'type': Accessor }, 'export': 'value' },
					{ 'part': { 'type': Parts.PartType.COMMA }, 'export': 'comma', 'required': false },
				], 'export': 'fields', 'required': false // Not like we are going to have a type with no fields though
			},
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
		]);
	};
	public create = ObjectLiteral.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const objectData: ObjectLiteralData = { fields: [] as any } as ObjectLiteralData;
		for (const field of data.fields) {
			objectData.fields.push({
				name: field.name,
				value: field.value
			});
		};

		objectData.id = scope.alias(scope.generateRandomId());
		scope.set(`literal.${objectData.id}`, objectData);

		return { scope: scope, export: objectData };
	};
};

export class StringLiteral extends Feature.Feature<StringLiteralData> {
	constructor() {
		super([
			{
				'or': [
					[
						{ 'part': { 'type': Parts.PartType.DOUBLE_QUOTE_STRING }, 'export': 'data' },
					],
					[
						{ 'part': { 'type': Parts.PartType.SINGLE_QUOTE_STRING }, 'export': 'data' },
					],
					[
						{ 'part': { 'type': Parts.PartType.BACKTICK_QUOTE_STRING }, 'export': 'data' }, // Implement backtick interpolation
					]
				], 'export': 'string'
			}
		]);
	};
	public create = StringLiteral.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const stringData: StringLiteralData = {} as StringLiteralData;
		stringData.data = data.string.data.slice(1, -1);
		stringData.id = scope.alias(`${scope.generateRandomId()}`);
		scope.set(`literal.${stringData.id}`, stringData);

		return { scope, export: stringData }
	};

	public toAssemblyData(stringLiteralData: StringLiteralData, scope: Feature.Scope) {
		let content = `
${stringLiteralData.id}:
	.asciz "${stringLiteralData.data}"
		`;

		return content;
	}
};