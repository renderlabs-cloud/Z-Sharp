import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Util } from '~/util';
import { Identifier, IdentifierData } from '~/features/identifier';
import { TypeRefData } from '~/features/type';
import { ObjectLiteral, StringLiteral, ObjectLiteralData, StringLiteralData, } from '~/features/literal';
import { FunctionCall, FunctionCallData } from '~/features/function';

export enum PropertyType {
	STRING,
	OBJECT,

	CALL,

	REF
};

export type PropertyData = {
	type: TypeRefData,
	value: {
		string?: StringLiteralData,

		object?: ObjectLiteralData,

		call?: FunctionCallData,

		reference?: IdentifierData
	},
	is: PropertyType,
	id: string
};

export class Accessor extends Feature.Feature<PropertyData> {
	constructor() {
		super([
			{
				'or': [
					[
						{ 'feature': { 'type': ObjectLiteral }, 'export': 'object' }
					],
					[
						{ 'feature': { 'type': StringLiteral }, 'export': 'string' }
					],

					[
						{ 'feature': { 'type': FunctionCall }, 'export': 'call' }
					],

					[
						{ 'feature': { 'type': Identifier }, 'export': 'reference' }
					], // Must come last
				], 'export': 'declaration'
			}
		]);
	};
	public create = Accessor.create;
	public static create(data: any, scope: Feature.Scope, position: Errors.Position): Feature.Return<PropertyData> {
		let propertyData: PropertyData = {} as PropertyData;
		propertyData.value = {} as any;

		if (data?.declaration?.call) {
			propertyData.is = PropertyType.CALL;
			propertyData.value.call = new FunctionCall().create(data.declaration.call, scope, position).export;
		}

		else if (data?.declaration?.object) {
			propertyData.is = PropertyType.OBJECT;
			propertyData.value.object = new ObjectLiteral().create(data.declaration.object, scope, position).export;
		}

		else if (data?.declaration?.string) {
			propertyData.is = PropertyType.STRING;
			propertyData.value.string = new StringLiteral().create(data.declaration.string, scope, position).export;
			propertyData.type = { name: 'byte', list: { size: propertyData.value.string.data.length } };
		}

		else if (data?.declaration?.reference) {
			propertyData.is = PropertyType.REF;
			propertyData.value.reference = new Identifier().create(data.declaration.reference, scope, position).export;
		}

		else {
			propertyData.value = {};
		};

		propertyData.id = scope.alias(scope.generateRandomId());

		scope.set(`accessor.${propertyData.id}`, propertyData);

		return { scope, export: propertyData };
	};

	public toAssemblyText(propertyData: PropertyData, scope: Feature.Scope) {
		let content = `
/* Accessor */
		`;
		switch (propertyData.is) {
			case PropertyType.STRING: {
				content += `
MOV RDI, REF(${propertyData.value.string?.id})
				`;
				break;
			};
			case PropertyType.OBJECT: {
				content += `
MOV RDI, REF(${propertyData.value.object?.id})
				`;
				break;
			};
			case PropertyType.CALL: {
				content += `
MOV R8, REF(${propertyData.value.call?.function.id})
MOV R7, REF(${propertyData.value.call?.id})
				`;
				break;
			};
			default: {
				content += `
// ??? 
				`;
			};
		};

		return content;
	};

	public toAssemblyData(propertyData: PropertyData, scope: Feature.Scope) {
		let content = '';
		switch (propertyData.is) {
			case PropertyType.STRING: {
				content += `${new StringLiteral().toAssemblyData(propertyData.value.string as StringLiteralData, scope)}`;
				break;
			};
			default: {
				content += `
// ???
				`;
			};
		};
		return content;
	};
};
