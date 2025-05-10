import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';

type TypeData = {
	name?: string,
	properties?: ({ 'name': string, 'type': string, 'comma': boolean }),
	alias?: string
};

export class Type extends Feature.Feature {
	constructor() {
		super([ 
			{ 'part': { 'type': Parts.PartType.WORD, 'value': 'type' } },
			{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'name' },
			{ 'part': { 'type': Parts.PartType.EQUALS } },
			{ 'or': [
				[
					{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_OPEN } },
					{ 'repeat': [
						{ 'part': { 'type': Parts.PartType.WORD }, 'export': 'property' },
						{ 'part': { 'type': Parts.PartType.COLON } },
						{ 'feature': { 'type': Identifier }, 'export': 'type' },
						{ 'part': { 'type': Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
					], 'export': 'structure' },
					{ 'part': { 'type': Parts.PartType.CURLY_BRACKET_CLOSE } }
				]
			] },
			{ 'part': { 'type': Parts.PartType.SEMICOLON } }			
		]);
	};
	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		const typeData: TypeData = { };
		typeData.name = data.name;
		if (data.structure) {
			let structure: any[] = [ ];
			for (const i in data.structure) {
				const item = data.structure[i];
				if (!item?.comma && Number(i) < data.structure.length - 1) {
					throw new Errors.Syntax.Generic(data.structure[String(Number(i) + 1)], position);
				};
				if (structure.map((v: any) => {
					return v?.name == item?.name;	
				}).includes(true)) {
					throw new Errors.Syntax.Duplicate(item.name, position);
				};
				item.type = item.type.location;
				structure.push(item);
			};
			scope.set(`type.${typeData.name}`, typeData);
		};

		return { scope };
	};
};
