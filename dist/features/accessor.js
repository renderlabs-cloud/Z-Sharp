"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessor = exports.PropertyType = void 0;
const feature_1 = require("~/feature");
const identifier_1 = require("~/features/identifier");
const literal_1 = require("~/features/literal");
const function_1 = require("~/features/function");
const variable_1 = require("~/features/variable");
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["STRING"] = 0] = "STRING";
    PropertyType[PropertyType["OBJECT"] = 1] = "OBJECT";
    PropertyType[PropertyType["CALL"] = 2] = "CALL";
    PropertyType[PropertyType["REFERENCE"] = 3] = "REFERENCE";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
;
class Accessor extends feature_1.Feature.Feature {
    constructor() {
        super([
            {
                'or': [
                    [
                        { 'feature': { 'type': literal_1.ObjectLiteral }, 'export': 'object' }
                    ],
                    [
                        { 'feature': { 'type': literal_1.StringLiteral }, 'export': 'string' }
                    ],
                    [
                        { 'feature': { 'type': function_1.FunctionCall }, 'export': 'call' }
                    ],
                    [
                        { 'feature': { 'type': identifier_1.Identifier }, 'export': 'reference' }
                    ], // Must come last
                ], 'export': 'declaration'
            }
        ]);
    }
    ;
    create = Accessor.create;
    static create(data, scope, position) {
        let propertyData = {};
        propertyData.value = {};
        if (data?.declaration?.call) {
            propertyData.is = PropertyType.CALL;
            propertyData.value.call = new function_1.FunctionCall().create(data.declaration.call, scope, position).export;
            propertyData.type = propertyData.value.call.function.type;
            propertyData.relid = propertyData.value.call.id;
        }
        else if (data?.declaration?.object) {
            propertyData.is = PropertyType.OBJECT;
            propertyData.value.object = new literal_1.ObjectLiteral().create(data.declaration.object, scope, position).export;
            propertyData.type = { object: { fields: propertyData.value.object.fields } };
            propertyData.relid = propertyData.value.object.id;
        }
        else if (data?.declaration?.string) {
            propertyData.is = PropertyType.STRING;
            propertyData.value.string = new literal_1.StringLiteral().create(data.declaration.string, scope, position).export;
            propertyData.type = { name: 'byte', list: { size: propertyData.value.string.data.length - 1 } };
            propertyData.relid = propertyData.value.string.id;
        }
        else if (data?.declaration?.reference) {
            propertyData.is = PropertyType.REFERENCE;
            let _variable = variable_1.Variable.get({ accessor: data }, scope, position, true);
            if (_variable) {
                propertyData.type = _variable.type;
                propertyData.value.reference = _variable.declaration;
                propertyData.relid = propertyData.value.reference.id;
            }
            else {
                propertyData.value.reference = new Accessor().create(data.declaration.reference, scope, position).export;
                propertyData.type = propertyData.value.reference.type;
                propertyData.relid = propertyData.value.reference.relid;
            }
            ;
        }
        else {
            propertyData.value = {};
        }
        ;
        propertyData.id = scope.alias(scope.generateRandomId());
        scope.set(`accessor.${propertyData.id}`, propertyData);
        return { scope, export: propertyData };
    }
    ;
    toAssemblyText(propertyData, scope) {
        let content = `
/* Accessor */
		`;
        switch (propertyData.is) {
            case PropertyType.STRING:
                {
                    content += `
MOV (Z8, REF(${propertyData.value.string?.id}))
				`;
                    break;
                }
                ;
            case PropertyType.OBJECT:
                {
                    content += `
MOV (Z8, REF(${propertyData.value.object?.id}))
				`;
                    break;
                }
                ;
            case PropertyType.CALL:
                {
                    content += `
${(new function_1.FunctionCall).toAssemblyText(propertyData.value.call, scope)}
				`;
                    break;
                }
                ;
            case PropertyType.REFERENCE:
                {
                    content += `${(new Accessor).toAssemblyText(propertyData.value.reference, scope)}`;
                    break;
                }
                ;
            default:
                {
                    content += `
// ??? 
				`;
                    break;
                }
                ;
        }
        ;
        return content;
    }
    ;
    toAssemblyData(propertyData, scope) {
        let content = '';
        switch (propertyData.is) {
            case PropertyType.STRING:
                {
                    content += `${(new literal_1.StringLiteral).toAssemblyData(propertyData.value.string, scope)}`;
                    break;
                }
                ;
            case PropertyType.OBJECT:
                {
                    content += `${(new literal_1.ObjectLiteral).toAssemblyData(propertyData.value.object, scope)}`;
                    break;
                }
                ;
            case PropertyType.CALL:
                {
                    content += `${(new function_1.FunctionCall).toAssemblyData(propertyData.value.call, scope)}`;
                    break;
                }
                ;
            case PropertyType.REFERENCE:
                {
                    content += `${(new Accessor).toAssemblyData(propertyData.value.reference, scope)}`;
                    break;
                }
                ;
            default:
                {
                    content += '// ???\n';
                    break;
                }
                ;
        }
        ;
        return content;
    }
    ;
}
exports.Accessor = Accessor;
;
