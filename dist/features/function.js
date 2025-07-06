"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = exports.FunctionCall = exports.Function = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const assembler_1 = require("~/assembler");
const util_1 = require("~/util");
const error_1 = require("~/error");
const type_1 = require("~/features/type");
const accessor_1 = require("~/features/accessor");
const body_1 = require("~/features/body");
const identifier_1 = require("~/features/identifier");
const variable_1 = require("~/features/variable");
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
            const identifier = identifier_1.Identifier.create(data.function.declaration.reference, scope, position).export;
            const _function = scope.get(`function.${scope.resolve(scope.flatten(identifier.path))}`);
            if (!_function) {
                util_1.Util.error(new error_1.Errors.Syntax.Generic(`Function ${scope.flatten(identifier.path)} not defined`, position));
            }
            ;
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
        functionData.type = type_1.Type.get(data.type, scope, position) ?? {};
        functionData.parameters = [];
        for (const parameter of data.parameters) {
            const type = type_1.Type.get(parameter.type, scope, position);
            parameter.id = functionData.scope.alias(parameter.name);
            functionData.parameters.push({ name: parameter.name, type: type ?? {}, id: parameter.id });
        }
        ;
        const features = syntax_1.Syntax.toFeatures(data.body.parts, functionData.scope, position);
        functionData.body = features;
        scope.set(`function.${functionData.id}`, functionData);
        return { scope, export: functionData };
    }
    ;
    async toAssemblyText(functionData, scope) {
        let content = `
/* Function ${functionData.name} */\nFUNC ${functionData.id}, PARAMS
		`;
        for (const parameter of functionData.parameters) {
            parameter.id = functionData.scope.alias(parameter.name);
            content += `
PARAM ${parameter.type.id}, ${parameter.id}
			`;
        }
        ;
        content += `
PARAMS_END
		`;
        content += `
${await assembler_1.Assembler.assemble(functionData.body, functionData.scope, {})}
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
        const _function = Function.get(data, scope, position) || {};
        callData.function = _function;
        callData.parameters.value = [];
        callData.id = scope.alias(scope.generateRandomId());
        let i = 0;
        for (const parameter of data.parameters) {
            const _variable = variable_1.Variable.get(parameter, scope, position) ?? {};
            const accessor = _variable.declaration;
            callData.parameters.value.push({ value: accessor });
            if (!type_1.Type.isCompatible(_function.parameters[i].type, accessor.type)) {
                util_1.Util.error(new error_1.Errors.Syntax.Generic(`Parameter ${i + 1} of type ${type_1.Type.toString(accessor.type)} is not compatible with type ${type_1.Type.toString(_function.parameters[i].type)}`, position));
            }
            ;
            i++;
        }
        ;
        scope.set(`function_call_parameters.${callData.id}`, callData);
        return { scope: scope, export: callData };
    }
    ;
    toAssemblyText(callData, scope) {
        let content = `
/* Function call ${callData.function.name} */
MOV (Z7, ${callData.id})
MOV (Z8, ${callData.function.id})
CALL (Z8)
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
