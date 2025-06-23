"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessor = exports.PropertyType = void 0;
const feature_1 = require("~/feature");
const identifier_1 = require("~/features/identifier");
const literal_1 = require("~/features/literal");
const function_1 = require("~/features/function");
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["STRING"] = 0] = "STRING";
    PropertyType[PropertyType["OBJECT"] = 1] = "OBJECT";
    PropertyType[PropertyType["CALL"] = 2] = "CALL";
    PropertyType[PropertyType["REF"] = 3] = "REF";
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
        }
        else if (data?.declaration?.object) {
            propertyData.is = PropertyType.OBJECT;
            propertyData.value.object = new literal_1.ObjectLiteral().create(data.declaration.object, scope, position).export;
        }
        else if (data?.declaration?.string) {
            propertyData.is = PropertyType.STRING;
            propertyData.value.string = new literal_1.StringLiteral().create(data.declaration.string, scope, position).export;
            propertyData.type = { name: 'byte', list: { size: propertyData.value.string.data.length } };
        }
        else if (data?.declaration?.reference) {
            propertyData.is = PropertyType.REF;
            propertyData.value.reference = new identifier_1.Identifier().create(data.declaration.reference, scope, position).export;
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
MOV RDI, REF(${propertyData.value.string?.id})
				`;
                    break;
                }
                ;
            case PropertyType.OBJECT:
                {
                    content += `
MOV RDI, REF(${propertyData.value.object?.id})
				`;
                    break;
                }
                ;
            case PropertyType.CALL:
                {
                    content += `
MOV R8, REF(${propertyData.value.call?.function.id})
MOV R7, REF(${propertyData.value.call?.id})
				`;
                    break;
                }
                ;
            default:
                {
                    content += `
// ??? 
				`;
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
                    content += `${new literal_1.StringLiteral().toAssemblyData(propertyData.value.string, scope)}`;
                    break;
                }
                ;
            default:
                {
                    content += `
// ???
				`;
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
