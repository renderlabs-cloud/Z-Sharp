import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { PropertyData } from '~/features/accessor';
import { FunctionData } from '~/features/function';
import { ListTypeData, List } from '~/features/list';
import { ObjectTypeData } from '~/features/object';
import { Accessor } from '~/features/accessor';
import { Util } from '~/util';

import lodash from 'lodash';

type TypeField = {
	name: string,
	type: TypeRefData,
	comma?: boolean
	id: string;
};

type TypeFields = {
	value?: TypeField[],
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
	label?: string,
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

	public static get(data: any, scope: Feature.Scope, position: Errors.Position): TypeRefData | null {
		if (data?.type?.alias) {
			const alias = Identifier.create(data.type.alias, scope, position).export;
			const name = scope.flatten(alias.path);
			return scope.get(`type.${scope.resolve(name)}`) as TypeRefData || null;
		};

		return null;
	};

	public static toString(type: TypeRefData) {
		let content = '';
		if (type?.name) {
			content += type.name;
		};
		if (type?.generic?.length) {
			content += '<';
			content += type.generic.map((v: any) => {
				return Type.toString(v);
			}).join(', ');
			content += '>';
		};
		if (type?.fields && !type.name) {
			content += '{';
			content += type.fields.value?.map((v: TypeField) => {
				return `${v.name}: ${Type.toString(v.type)}`;
			}).join(', ');
			content += '}';
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
		function listComponentCompatible(list1: TypeRefData['list'], list2: TypeRefData['list']): boolean {
			if (list1?.size == list2?.size || (list1?.size == null && list2?.size !== undefined)) {
				if (list1?.next && list2?.next) {
					return Type.isCompatible(list1.next, list2?.next);
				} else {
					return true;
				};
			};
			return false;
		};
		delete (type1 as any).typeRef;
		delete (type2 as any).typeRef;
		if (lodash.isEqual(type1, type2)) {
			return true;
		};

		if (!listComponentCompatible(type1?.list, type2?.list)) {
			return false;
		};

		return true;
	};
	public static incompatible(type1: TypeRefData, type2: TypeRefData, position: Errors.Position): never {
		Util.error(new Errors.Syntax.Generic(`Type ${Type.toString(type2)} is incompatible with type ${Type.toString(type1)}`, position));
	};
	public create = Type.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<TypeRefData> {
		const typeData: TypeRefData = {};
		typeData.name = data.name;
		typeData.id = scope.alias(data.name);
		if (data.type.fields) {
			let typeFields: TypeFields = { value: [], id: typeData.id };
			for (const i in data.type.fields) {
				const item = data.type.fields[i];
				if (!item.comma && Number(i) < data.type.fields.length - 1) {
					Util.error(new Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position));
				};
				item.id = scope.alias(item.name);
				let _type = Type.get(item.typeRef, scope, position);
				if (!_type) {
					Util.error(new Errors.Reference.Undefined(item.typeRef, position));
				};
				item.type = _type;

				// Check if type is defined
				if (typeFields.value?.map((v: TypeField) => {
					return v?.name == item?.name && v && item;
				}).includes(true)) {
					Util.error(new Errors.Syntax.Duplicate(item.name, position));
				};
				scope.set(`type_field.${item.id}`, _type);
				typeFields.value?.push(item);
			};
			typeData.fields = typeFields;
		};
		scope.set(`type.${typeData.id}`, typeData);

		return { scope, export: typeData };
	};

	public toAssemblyData(typeData: TypeRefData, scope: Feature.Scope) {
		let content = `TYPE ${(typeData as any)?.id}\n`;
		for (const field of typeData.fields?.value || []) {
			content += '\tTYPE_FIELD ';
			if (field.type.name == 'byte') {
				content += `BYTE, ${field.name}, ${field.type.list?.size || ''}\n`;
			} else {

			};

			content += `// ??? \n`;
		};
		content += 'TYPE_END\n';
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

		if (data?.type?.alias) {
			typeRef = Type.get(data, scope, position) ?? {};
		};
		if (data?.list) {
			const list = List.create(data.list, scope, position).export;
			const subType: TypeRefData = {};
			subType.list = subType.list?.next?.list;
			list.next = subType;
			typeRef.list = list;
		};
		/** TODO: 
		 * ...
		*/

		return { scope, export: typeRef };
	};
};