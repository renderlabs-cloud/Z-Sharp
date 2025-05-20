import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';

type TypeField = { 
	'name': string,
	'type': TypeRef,
	'comma': boolean 
};

type TypeFields = {
	name?: string,
	fields?: TypeField[],
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
};

export class Type extends Feature.Feature {
	constructor() {
		super([ 
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'type' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'or': [
				[
					{ 'part': { 'type': Parts.PartType.EQUALS } },
					{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
					{ 'repeat': [
						{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
						{ 'part': { 'type': Parts.PartType.COLON } },
						{ 'feature': { 'type': TypeRef }, 'export': 'type' },
						{ 'part': { 'type': Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
					], 'export': 'fields' },
					{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
				],
			],  'export': 'type' }
		]);
	};
	
	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const typeData: TypeData = { };
		typeData.name = data.name;
		if (data.type.fields) {
			let fields: TypeField[] = [ ];
			for (const i in data.type.fields) {
				const item = data.type.fields[i];
				if (!item.comma && Number(i) < data.type.fields.length - 1) {
					throw new Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
				};
				// Check if type is defined
				if (fields.map((v: any) => {
					return v?.name == item?.name && v && item;	
				}).includes(true)) {
					throw new Errors.Syntax.Duplicate(item.name, position);
				};
				fields.push(item);
			};
			typeData.fields = fields;
		};
		scope.set(`type.${typeData.name}`, typeData);
		
		return { scope, exports: typeData };
	};
	
	public static toAssembly(typeData: TypeData, scope: Feature.Scope) {
		let content = `TYPE ${(typeData as any)?.name}\n`; // ? should not be required here!
		if ((typeData as TypeFields).fields) {
			for (const field of (typeData as TypeFields).fields || [ ]) { // || should not be require here!
				content += '\tTYPE_FIELD ';
				content += `${(field as any).name}, `;
				if ((field.type as any)?.name == 'byte') {
					content += 'BYTE, ';
				} else {
					// Verify type exists
					content += `${(field as any).type.type.type.name}, `;
				};
				content += '\n';
			};
		};
		content += 'TYPE_END'; 
		return content;
	};
};

export class TypeRef extends Feature.Feature {
	constructor() {
		super([
			{ 'or': [
					[
						{ 'feature': { 'type': Identifier }, 'export': 'type' },
					],
					[
						{ 'repeat': [
							{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_OPEN } },
							{ 'part': { 'type': Parts.PartType.NUMBER }, 'required': false, 'export': 'size' },
							{ 'part': { 'type': Parts.PartType.SQUARE_BRACKET_CLOSE } },
						], 'export': 'size' }
					]
				], 'export': 'type'
			}
		]);
	};
};
