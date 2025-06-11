import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { List } from '~/features/list';
import { Util } from '~/util';

type TypeField = {
	name: string,
	type: TypeRef,
	comma: boolean
	id: string;
};

type TypeFields = {
	name?: string,
	fields?: TypeField[],
	id?: string;
	// To be extended in the future
};

export type TypeData =
	& TypeFields
	& TypeRef
	;

type TypeRefBuildPart =
	| TypeData
	| '|'
	| '&'
	;

export type TypeRefData = {
	name?: string,
	generic?: TypeData[],
	build?: TypeRefBuildPart[]
	id?: string;
};

export class Type extends Feature.Feature {
	constructor() {
		super([
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'type' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'part': { 'type': Parts.PartType.EQUALS } },
			{
				'or': [
					[
						{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
						{
							'repeat': [
								{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
								{ 'part': { 'type': Parts.PartType.COLON } },
								{ 'feature': { 'type': TypeRef }, 'export': 'typeRef' },
								{ 'part': { 'type': Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
							], 'export': 'fields'
						},
						{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
					],
					[
						{ 'feature': { 'type': TypeRef }, 'export': 'alias' }
					]
				], 'export': 'type'
			}
		]);
	};

	public static get(data: any, scope: Feature.Scope) {
		if (data?.type?.alias) {
			const alias = Identifier.create(data.type.alias, scope, {}).export;
			const name = scope.flatten(alias.path);
			return scope.get(`type.${scope.resolve(name)}`);
		};
	};
	public create = Type.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const typeData: TypeData = {} as TypeData;
		typeData.name = data.name;
		typeData.id = scope.alias(data.name);
		if (data.type.fields) {
			let fields: TypeField[] = [];
			for (const i in data.type.fields) {
				const item = data.type.fields[i];
				if (!item.comma && Number(i) < data.type.fields.length - 1) {
					throw new Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
				};
				item.id = `type_field.${scope.alias(item.name)}`;
				// Check if type is defined
				if (fields.map((v: any) => {
					return v?.name == item?.name && v && item;
				}).includes(true)) {
					throw new Errors.Syntax.Duplicate(item.name, position);
				};
				scope.set(item.id, item);
				fields.push(item);
			};
			typeData.fields = fields;
		};
		scope.set(`type.${typeData.id}`, typeData);

		return { scope, export: typeData };
	};

	public toAssemblyText(typeData: TypeData, scope: Feature.Scope) {
		let content = `
TYPE ${(typeData as any)?.id}
		`; // ? should not be required here!
		for (const _field of (typeData as TypeFields)?.fields || []) { // || should not be require here!
			const field = _field as any;
			content += `
	TYPE_FIELD 
			`;
			const fieldType = Type.get(field.typeRef, scope);
			if (!fieldType) {
				throw new Errors.Reference.Undefined(field.name, field.position as Errors.Position);
			};
			if (fieldType.typeRef.type?.alias.name == 'byte') {
				content += 'BYTE, ';
			} else {
				if (fieldType.typeRef.type.alias) {
					const alias = scope.get(`type.${scope.resolve(scope.flatten(fieldType.typeRef.type.alias.path))}`);
					content += `${alias.id}, `;
				} else {
					// Add more cases
				};
			};

			content += `
${fieldType.id}, 
			`;

		};
		content += `
TYPE_END
		`;
		return content;
	};
};

export class TypeRef extends Feature.Feature {
	constructor() {
		super([
			{
				'or': [
					[
						{ 'feature': { 'type': Identifier }, 'export': 'alias' },
					],
				], 'export': 'type',
			},
			{
				'repeat': [
					{ 'feature': { 'type': List }, 'export': 'list' }
				], 'export': 'lists', 'required': false
			}
		]);
	};
};

export namespace TypeValidation {
	export function expects(type: TypeData, expected: TypeData) {
		if (type !== expected) {
			throw new Errors.Reference.TypeMismatch(type.name || '', {}); // TODO: position
		};
		return type === expected;
	};
};