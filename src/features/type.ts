import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';

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
type TypeData =
	| TypeFields
	| TypeRef
	;

type TypeRefBuildPart =
	| TypeData
	| '|'
	| '&'
	;

type TypeRefData = {
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
			{
				'or': [
					[
						{ 'part': { 'type': Parts.PartType.EQUALS } },
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

	public static get (data: any, scope: Feature.Scope) {
		if (data.type.alias) {
			return scope.get(`type.${scope.resolve(data.type.alias.name)}`);
		};
	};

	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const typeData: TypeData = {};
		typeData.name = data.name;
		typeData.id = `type.${scope.alias(data.name)}`;
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
		scope.set(typeData.id, typeData);

		return { scope, exports: typeData };
	};

	public toAssembly(typeData: TypeData, scope: Feature.Scope) {
		let content = `TYPE ${(typeData as any)?.id}\n`; // ? should not be required here!
		if ((typeData as TypeFields).fields) {
			for (const _field of (typeData as TypeFields).fields || []) { // || should not be require here!
				const field = _field as any;
				content += '\tTYPE_FIELD ';
				const type = scope.get(field.id);
				if (!type) {
					throw new Errors.Reference.Undefined(field.name, field.position as Errors.Position);
				};
				if (type.typeRef.type?.alias.name == 'byte') {
					content += 'BYTE, ';
				} else {
					if (type.typeRef.type.alias) {
						const alias = scope.get(`type.${scope.resolve(type.typeRef.type.alias.name)}`);
						content += `${alias.id}, `;
					} else {
						// Add more cases
					};
				};

				content += `${type.id}, `;
				content += '\n';
			};
		};
		content += 'TYPE_END\n';
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
					/*	[
							{
								'repeat': [
									{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_OPEN } },
									{ 'part': { 'type': Parts.PartType.NUMBER }, 'required': false, 'export': 'size' },
									{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_CLOSE } },
								], 'export': 'size'
							}
						]*/ // Replace with features/array.ts
				], 'export': 'type',
			}
		]);
	};
};
