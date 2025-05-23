"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const type_1 = require("~/features/type");
const accessor_1 = require("~/features/accessor");
class Variable extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'let' } },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'part': { 'type': parts_1.Parts.PartType.COLON } },
            { 'feature': { 'type': type_1.TypeRef }, 'export': 'type' },
            {
                'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.EQUALS } },
                        { 'feature': { 'type': accessor_1.Accessor }, 'export': 'acessor' }
                    ]
                ], 'export': 'declaration'
            }
        ]);
    }
    ;
    create(data, scope, position) {
        let variableData = {};
        variableData.name = data.name;
        variableData.id = `var.${scope.alias(variableData.name)}`;
        console.log(variableData, data);
        return { scope, exports: variableData };
    }
    ;
    toAssembly(variableData, scope) {
        let content = `VAR ${variableData.id}\n`;
        return content;
    }
    ;
}
exports.Variable = Variable;
;
