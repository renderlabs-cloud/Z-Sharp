"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const syntax_1 = require("~/syntax");
const assembler_1 = require("~/assembler");
const type_1 = require("~/features/type");
const body_1 = require("~/features/body");
class Function extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'function' } },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'part': { 'type': parts_1.Parts.PartType.PARENTHESIS_OPEN } },
            { 'repeat': [
                    { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
                    { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                    { 'feature': { 'type': type_1.TypeRef }, 'export': 'type' },
                    { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
                ], 'export': 'parameters', required: false },
            { 'part': { 'type': parts_1.Parts.PartType.PARENTHESIS_CLOSE } },
            { 'part': { 'type': parts_1.Parts.PartType.COLON } },
            { 'feature': { 'type': type_1.TypeRef }, 'export': 'type' },
            { 'feature': { 'type': body_1.Body }, 'export': 'body' }
        ]);
    }
    ;
    create(data, scope, position) {
        let functionData = {};
        functionData.name = data.name;
        functionData.id = `function.${scope.alias(functionData.name)}`;
        functionData.scope = new feature_1.Feature.Scope(scope.importer, functionData.name, scope);
        functionData.type = data.type;
        functionData.parameters = data.parameters;
        const features = syntax_1.Syntax.toFeatures(data.body.parts, functionData.scope, position);
        functionData.body = features;
        console.log(functionData, data);
        scope.set(functionData.id, functionData);
        return { scope, exports: functionData };
    }
    ;
    toAssembly(functionData, scope) {
        let content = `FUNC ${functionData.id}, PARAMS\n `;
        for (const parameter of functionData.parameters) {
            const type = type_1.Type.get(parameter.type, scope);
            parameter.id = functionData.scope.alias(parameter.name);
            console.log(parameter);
            content += `PARAM ${type.id}, ${parameter.id}\n`;
        }
        ;
        content += `PARAMS_END\n`;
        content += `${assembler_1.Assembler.assemble(functionData.body)}\nFUNC_END\n`;
        return content;
    }
    ;
}
exports.Function = Function;
;
