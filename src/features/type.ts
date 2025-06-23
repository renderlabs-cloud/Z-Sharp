import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { PropertyData } from '~/features/accessor';
import { FunctionData } from '~/features/function';
import { ListTypeData, List } from '~/features/list';
import { Util } from '~/util';

import lodash from 'lodash';

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

type TypeRefBuildPart =
	| TypeRefData
	| '|'
	| '&'
	;

export type TypeRefData = {
	name?: string,
	generic?: TypeRefData[],
	build?: TypeRefBuildPart[],
	fields?: TypeFields,
	list?: ListTypeData,
	class?: {
		extends: TypeRefData[],
		implements: TypeRefData[],
		properties: PropertyData[],
		methods: FunctionData[],
	},
	id?: string;
};

export class Type extends Feature.Feature<TypeRefData> {
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

	public static get(data: any, scope: Feature.Scope): TypeRefData | null {
		if (data?.type?.alias) {
			const alias = Identifier.create(data.type.alias, scope, {}).export;
			const name = scope.flatten(alias.path);
			return scope.get(`type.${scope.resolve(name)}`) as TypeRefData || null;
		};

		return null;
	};
	public static toString(type: TypeRefData) {
		let content = '';
		content += type.name;
		if (type?.generic?.length) {
			content += '<';
			content += type.generic.map((v: any) => {
				return Type.toString(v);
			}).join(', ');
			content += '>';
		};
		if (type?.list) {
			content += '[';
			if (type.list.size) {
				content += type.list.size;
			};
			content += ']';
		};
		/** TODO:
		 * ...
		 */
		return content;
	};
	public static isCompatible(type1: TypeRefData, type2: TypeRefData): boolean {
		delete (type1 as any).typeRef;
		delete (type2 as any).typeRef;
		if (type1 == type2) {
			return true;
		};
		if (type1?.list && type2?.list && lodash.isEqual({ ...type1, list: null }, { ...type2, list: null })) {
			return type1?.list?.size == undefined;
		};

		if (type1?.generic?.length == type2?.generic?.length) {
			return type1?.generic?.every((v: any, i: number) => {
				return Type.isCompatible(v, type2.generic?.[i] || {}); // This will return false next iteration
			}) || false;
		};

		return false;
	};
	public static incompatible(type1: TypeRefData, type2: TypeRefData, position: Errors.Position): never {
		throw new Errors.Syntax.Generic(`Type ${Type.toString(type2)} is incompatible with type ${Type.toString(type1)}`, position);
	};
	public create = Type.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<TypeRefData> {
		const typeData: TypeRefData = {};
		typeData.name = data.name;
		typeData.id = scope.alias(data.name);
		if (data.type.fields) {
			let typeFields: TypeFields = { fields: [], id: typeData.id, name: typeData.name };
			for (const i in data.type.fields) {
				const item = data.type.fields[i];
				if (!item.comma && Number(i) < data.type.fields.length - 1) {
					throw new Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
				};
				item.id = scope.alias(item.name);
				// Check if type is defined
				if (typeFields.fields?.map((v: TypeField) => {
					return v?.name == item?.name && v && item;
				}).includes(true)) {
					throw new Errors.Syntax.Duplicate(item.name, position);
				};
				scope.set(`type_field.${item.id}`, item);
				typeFields.fields?.push(item);
			};
			typeData.fields = typeFields;
		};
		scope.set(`type.${typeData.id}`, typeData);

		return { scope, export: typeData };
	};

	public toAssemblyText(typeData: TypeRefData, scope: Feature.Scope) {
		let content = `
TYPE ${(typeData as any)?.id}
		`;
		for (const _field of typeData.fields?.fields || []) {
			const field = _field as any;
			content += `
	TYPE_FIELD 
			`;
			const fieldType = Type.get(field.typeRef, scope);
			if (!fieldType) {
				throw new Errors.Reference.Undefined(field.name, field.position as Errors.Position);
			};
			if (fieldType.name == 'byte') {
				content += 'BYTE, ';
			} else {

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

export class TypeRef extends Feature.Feature<TypeRefData> {
	constructor() {
		super([
			{
				'or': [
					[
						{ 'feature': { 'type': Identifier }, 'export': 'alias' },
					],
					[
						{ 'feature': { 'type': TypeRef }, 'export': 'typeRef' }
					]
				], 'export': 'type',
			},
			{ 'feature': { 'type': List }, 'export': 'list', 'required': false }
		]);
	};
	public create = TypeRef.create
	public static create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let typeRef: TypeRefData = {};

		Util.debug(`Data`, data);

		if (data?.type?.alias) {
			typeRef = Type.get(data, scope) || {};
			Util.debug(`TypeRef from alias created`, typeRef);
		};
		if (data?.list) {
			const list = List.create(data.list, scope, position).export;
			const subType: TypeRefData = {};
			subType.list = subType.list?.type?.list;
			list.type = subType;
			typeRef.list = list;
		};
		/** TODO: 
		 * ...
		*/

		return { scope, export: typeRef };
	};
};