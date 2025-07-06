import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Accessor, PropertyData } from '~/features/accessor';
import { TypeRef, TypeRefData, Type } from '~/features/type';
import { Util } from '~/util';

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

export function toPaddedBytes(data: string, tabs: number = 8, row: number = 8) {
	let wrap = row;
	return Array.from(data).map(c => {
		return `0x${c.charCodeAt(0).toString(16)}`;
	}).map((v) => {
		if (wrap++ >= row) {
			wrap = 0;
			return `\\\n${('\t').repeat(tabs)}${v}`;
		};
		return v;
	}).join(', ');
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
				], 'export': 'fields', 'required': false
			},
			{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
		]);
	};
	public create = ObjectLiteral.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const objectData: ObjectLiteralData = { fields: [] as any } as ObjectLiteralData;
		for (const field of data.fields ?? []) {
			const value = Accessor.create(field.value, scope, position).export;
			objectData.fields.push({
				name: field.name,
				value: value,
			});
		};

		objectData.id = scope.alias(scope.generateRandomId());
		scope.set(`literal.${objectData.id}`, objectData);

		return { scope: scope, export: objectData };
	};

	public toAssemblyData(objectData: ObjectLiteralData, scope: Feature.Scope) {
		let content = '';

		if (scope._asm_data[objectData.id]) {
			return '';
		};

		content += `
/* Object Literal */
${objectData.id}:
	${objectData.fields.map((field) => {
			Util.debug(field);
			return `
${(new Accessor).toAssemblyData(field.value, scope)}
		`;
		}).join('')}
		`;

		return content;
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
		if (scope._asm_data[stringLiteralData.id]) {
			return '';
		};
		let content = `
${stringLiteralData.id}:
	.4byte ${toPaddedBytes(stringLiteralData.data, 2, 16)}
	${stringLiteralData.id}_len = . - ${stringLiteralData.id} 
		`;

		return content;
	}
};