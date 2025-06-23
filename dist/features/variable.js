"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const error_1 = require("~/error");
const type_1 = require("~/features/type");
const accessor_1 = require("~/features/accessor");
const util_1 = require("~/util");
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
        if (scope.get(`var.${data.name}`)) {
            throw new error_1.Errors.Syntax.Duplicate(data.name, position);
        }
        ;
        let variableData = {};
        variableData.name = data.name;
        variableData.id = scope.alias(variableData.name);
        variableData.type = new type_1.TypeRef().create(data.type, scope, position).export;
        variableData.declaration = new accessor_1.Accessor().create(data.declaration, scope, position).export;
        util_1.Util.debug(`Variable ${variableData.name} created`, variableData);
        if (!type_1.Type.isCompatible(variableData.type, variableData.declaration.type)) {
            type_1.Type.incompatible(variableData.type, variableData.declaration.type, position);
        }
        ;
        scope.set(`var.${variableData.id}`, variableData);
        return { scope, export: variableData };
    }
    ;
    toAssemblyText(variableData, scope) {
        let variable = new accessor_1.Accessor();
        let definition = `
${variable.toAssemblyText(variableData.declaration, scope)}
		`;
        let content = `
/* Variable ${variableData.name} */
${definition}
VAR ${variableData.id}, RDI, RDI
SCOPE SET ${variableData.id}, RDI
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
