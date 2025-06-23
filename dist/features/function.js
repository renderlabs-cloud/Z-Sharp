"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = exports.FunctionCall = exports.Function = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const assembler_1 = require("~/assembler");
const type_1 = require("~/features/type");
const accessor_1 = require("~/features/accessor");
const body_1 = require("~/features/body");
const identifier_1 = require("~/features/identifier");
class Function extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'function' } },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'part': { 'type': parts_1.Parts.PartType.PARENTHESIS_OPEN } },
            {
                'repeat': [
                    { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
                    { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                    { 'feature': { 'type': type_1.TypeRef }, 'export': 'type' },
                    { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
                ], 'export': 'parameters', required: false
            },
            { 'part': { 'type': parts_1.Parts.PartType.PARENTHESIS_CLOSE } },
            { 'part': { 'type': parts_1.Parts.PartType.COLON } },
            { 'feature': { 'type': type_1.TypeRef }, 'export': 'type' },
            { 'feature': { 'type': body_1.Body }, 'export': 'body' }
        ]);
    }
    ;
    static get(data, scope, position) {
        if (data.function) {
            // Update !!!
            const functionData = identifier_1.Identifier.create(data.function.declaration.reference, scope, position).export;
            const _function = scope.get(`function.${scope.resolve(scope.flatten(functionData.path))}`);
            return _function;
        }
        ;
    }
    ;
    create = Function.create;
    static create(data, scope, position) {
        let functionData = {};
        functionData.name = data.name;
        functionData.id = scope.alias(functionData.name);
        functionData.scope = new feature_1.Feature.Scope(scope.importer, functionData.name, scope);
        functionData.type = data.type;
        functionData.parameters = data.parameters;
        const features = syntax_1.Syntax.toFeatures(data.body.parts, functionData.scope, position);
        functionData.body = features;
        scope.set(`function.${functionData.id}`, functionData);
        return { scope, export: functionData };
    }
    ;
    toAssemblyText(functionData, scope) {
        let content = `
/* Function ${functionData.name} */\nFUNC ${functionData.id}, PARAMS
		`;
        for (const parameter of functionData.parameters) {
            const type = type_1.Type.get(parameter.type, scope);
            parameter.id = functionData.scope.alias(parameter.name);
            content += `
PARAM ${type?.id}, ${parameter.id}
			`;
        }
        ;
        content += `
PARAMS_END
		`;
        content += `
${assembler_1.Assembler.assemble(functionData.body, functionData.scope, {})}
FUNC_END
		`;
        return content;
    }
    ;
}
exports.Function = Function;
;
class FunctionCall extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'feature': { 'type': accessor_1.Accessor }, 'export': 'function' },
            { 'part': { 'type': parts_1.Parts.PartType.QUESTION }, 'export': 'ternary', 'required': false },
            { 'part': { 'type': parts_1.Parts.PartType.PARENTHESIS_OPEN } },
            {
                'repeat': [
                    { 'feature': { 'type': accessor_1.Accessor }, 'export': 'accessor' },
                    { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'export': 'comma', 'required': false }
                ], 'required': false, 'export': 'parameters'
            },
            { 'part': { 'type': parts_1.Parts.PartType.PARENTHESIS_CLOSE } }
        ]);
    }
    ;
    create = FunctionCall.create;
    static create(data, scope, position) {
        const callData = { parameters: {} };
        const _function = Function.get(data, scope, position);
        callData.function = _function;
        callData.parameters.value = data.parameters;
        callData.id = scope.alias(scope.generateRandomId());
        scope.set(`function_call_parameters.${callData.id}`, callData);
        return { scope: scope, export: callData };
    }
    ;
    toAssemblyText(callData, scope) {
        let content = `
MOV R8, ${callData.function.id}
MOV R7, ${callData.id}
CALL R8
		`;
        return content;
    }
    ;
    toAssemblyData(callData, scope) {
        let content = `
		${callData.id}:
		`;
        for (const parameter of callData.parameters.value) {
            content += `
	.quad ${parameter.value.id}
			`;
        }
        ;
        return content;
    }
    ;
}
exports.FunctionCall = FunctionCall;
;
class Return extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'return' } },
            { 'feature': { 'type': accessor_1.Accessor }, 'export': 'value' }
        ]);
    }
    ;
    create = Return.create;
    static create(data, scope, position) {
        const accessor = accessor_1.Accessor.create(data.value, scope, position);
        return { scope, export: accessor.export };
    }
    ;
    toAssemblyText(propertyData, scope) {
        scope.pushReturn(propertyData);
        return `
RETURN ${propertyData.id}
		`;
    }
    ;
}
exports.Return = Return;
;
