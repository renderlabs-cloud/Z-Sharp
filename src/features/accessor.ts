import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Identifier } from '~/features/identifier';
import { TypeRef } from '~/features/type';

type PropertyData = {
	name: string,
	type: TypeRef,
	value: 
		| Identifier
	,
	id: string
};

export class Accessor extends Feature.Feature {
	constructor() {
		super([
			{
				'or': [
					[
						{ 'feature': { 'type': Identifier }, 'export': 'identifier' },
					]
				], 'export': 'declaration'
			}
		]);
	};

	public create(data: any, scope: Feature.Scope, position: Errors.Position) {
		let propertyData: PropertyData = { } as PropertyData;
		console.log(data);

		return { scope, exports: propertyData };
	};

	public toAssembly(propertyData: PropertyData, scope: Feature.Scope) {
		let content = `// ???\n`;
		
		return content;
	};
};
