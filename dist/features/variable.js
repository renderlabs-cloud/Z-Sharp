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
            { 'part': { 'type': parts_1.Parts.PartType.EQUALS }, 'export': 'equals', required: false },
            { 'feature': { 'type': accessor_1.Accessor }, 'export': 'declaration' },
        ]);
    }
    ;
    create = Variable.create;
    static create(data, scope, position) {
        let variableData = {};
        variableData.name = data.name;
        variableData.id = scope.alias(variableData.name);
        variableData.type = data.type;
        variableData.declaration = new accessor_1.Accessor().create(data.declaration, scope, position).export;
        scope.set(`var.${variableData.id}`, variableData);
        return { scope, export: variableData };
    }
    ;
    toAssemblyText(variableData, scope) {
        let variable = new accessor_1.Accessor();
        let definition = `
		${variable.toAssemblyText(variableData.declaration, scope)}
		`;
        console.log(variableData.declaration, variable);
        let content = `
/* Variable ${variableData.name} */
${definition}
VAR ${variableData.id}, RDI, RDI
		`;
        return content;
    }
    ;
    toAssemblyData(variableData, scope) {
        let content = ``;
        content += new accessor_1.Accessor().toAssemblyData(variableData.declaration, scope);
        return content;
    }
}
exports.Variable = Variable;
;
