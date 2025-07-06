import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
import { Util } from '~/util';
import { Identifier, IdentifierData } from '~/features/identifier';
import { TypeRefData } from '~/features/type';
import { ObjectLiteral, StringLiteral, ObjectLiteralData, StringLiteralData, } from '~/features/literal';
import { FunctionCall, FunctionCallData } from '~/features/function';
import { Variable, VariableData } from '~/features/variable';

export enum PropertyType {
	STRING,
	OBJECT,

	CALL,

	REFERENCE
};

export type PropertyData = {
	type: TypeRefData,
	value: {
		string?: StringLiteralData,

		object?: ObjectLiteralData,

		call?: FunctionCallData,

		reference?: PropertyData
	},
	is: PropertyType,
	id: string,
	relid: string
};

export type PropertyTypeData = NonNullable<PropertyData['value'][keyof PropertyData['value']]>;

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
			propertyData.type = propertyData.value.call.function.type;
			propertyData.relid = propertyData.value.call.id;
		}

		else if (data?.declaration?.object) {
			propertyData.is = PropertyType.OBJECT;
			propertyData.value.object = new ObjectLiteral().create(data.declaration.object, scope, position).export;
			propertyData.type = { object: { fields: propertyData.value.object.fields } };
			propertyData.relid = propertyData.value.object.id;
		}

		else if (data?.declaration?.string) {
			propertyData.is = PropertyType.STRING;
			propertyData.value.string = new StringLiteral().create(data.declaration.string, scope, position).export;
			propertyData.type = { name: 'byte', list: { size: propertyData.value.string.data.length - 1 } };
			propertyData.relid = propertyData.value.string.id;
		}

		else if (data?.declaration?.reference) {
			propertyData.is = PropertyType.REFERENCE;
			let _variable = Variable.get({ accessor: data }, scope, position, true);
			if (_variable) {
				propertyData.type = _variable.type;
				propertyData.value.reference = _variable.declaration;
				propertyData.relid = propertyData.value.reference.id;
			} else {
				propertyData.value.reference = new Accessor().create(data.declaration.reference, scope, position).export;
				propertyData.type = propertyData.value.reference.type;
				propertyData.relid = propertyData.value.reference.relid;
			};
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
MOV (Z8, REF(${propertyData.value.string?.id}))
				`;
				break;
			};
			case PropertyType.OBJECT: {
				content += `
MOV (Z8, REF(${propertyData.value.object?.id}))
				`;
				break;
			};
			case PropertyType.CALL: {
				content += `
${(new FunctionCall).toAssemblyText(propertyData.value.call as FunctionCallData, scope)}
				`;
				break;
			};
			case PropertyType.REFERENCE: {
				content += `${(new Accessor).toAssemblyText(propertyData.value.reference as PropertyData, scope)}`;
				break;
			};
			default: {
				content += `
// ??? 
				`;
				break;
			};
		};

		return content;
	};

	public toAssemblyData(propertyData: PropertyData, scope: Feature.Scope) {
		let content = '';
		switch (propertyData.is) {
			case PropertyType.STRING: {
				content += `${(new StringLiteral).toAssemblyData(propertyData.value.string as StringLiteralData, scope)}`;
				break;
			};
			case PropertyType.OBJECT: {
				content += `${(new ObjectLiteral).toAssemblyData(propertyData.value.object as ObjectLiteralData, scope)}`;
				break;
			};
			case PropertyType.CALL: {
				content += `${(new FunctionCall).toAssemblyData(propertyData.value.call as FunctionCallData, scope)}`;
				break;
			};
			case PropertyType.REFERENCE: {
				content += `${(new Accessor).toAssemblyData(propertyData.value.reference as PropertyData, scope)}`;
				break;
			};
			default: {
				content += '// ???\n';
				break;
			};
		};
		return content;
	};
};
