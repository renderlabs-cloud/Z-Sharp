"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const error_1 = require("~/error");
const identifier_1 = require("~/features/identifier");
const type_1 = require("~/features/type");
const accessor_1 = require("~/features/accessor");
const header_1 = require("~/cli/header");
const util_1 = require("~/util");
var VariableType;
(function (VariableType) {
    VariableType["LET"] = "let";
    VariableType["CONST"] = "const";
})(VariableType || (VariableType = {}));
;
class Variable extends feature_1.Feature.Feature {
    constructor() {
        super([
            {
                'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'const' }, 'export': 'type' },
                    ],
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'let' }, 'export': 'type' },
                    ]
                ],
                'export': 'prefix'
            },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'part': { 'type': parts_1.Parts.PartType.COLON } },
            { 'feature': { 'type': type_1.TypeRef }, 'export': 'type' },
            { 'part': { 'type': parts_1.Parts.PartType.EQUALS }, 'export': 'equals', required: false },
            { 'feature': { 'type': accessor_1.Accessor }, 'export': 'declaration' },
        ]);
    }
    ;
    static get(data, scope, position, safe) {
        if (data.accessor) {
            const identifier = identifier_1.Identifier.create(data.accessor.declaration.reference, scope, position).export;
            let id = scope.resolve(scope.flatten(identifier.path));
            let _variable = scope.get(`var.${id}`);
            if (!_variable && !safe) {
                util_1.Util.error(new error_1.Errors.Syntax.Generic(`Variable ${header_1.Header.quote(scope.flatten(identifier.path))} not defined`, position));
            }
            ;
            return _variable;
        }
        ;
    }
    ;
    create = Variable.create;
    static create(data, scope, position) {
        if (scope.get(`var.${data.id}`)) {
            util_1.Util.error(new error_1.Errors.Syntax.Duplicate(data.name, position));
        }
        ;
        let variableData = {};
        variableData.name = data.name;
        variableData.id = scope.alias(variableData.name);
        variableData.type = new type_1.TypeRef().create(data.type, scope, position).export;
        variableData.declaration = new accessor_1.Accessor().create(data.declaration, scope, position).export;
        variableData.prefix = data.prefix.type;
        if (!type_1.Type.isCompatible(variableData.type /* TODO: or null */, variableData.declaration.type)) {
            type_1.Type.incompatible(variableData.type, variableData.declaration.type, position);
        }
        ;
        scope.set(`var.${variableData.id}`, variableData);
        return { scope, export: variableData };
    }
    ;
    toAssemblyText(variableData, scope) {
        let content = `
/* Variable ${variableData.name} */
${(new accessor_1.Accessor).toAssemblyText(variableData.declaration, scope)}
VAR ${variableData.id}, Z6, Z6
SCOPE_SET ${variableData.id}, Z6
		`;
        return content;
    }
    ;
    toAssemblyData(variableData, scope) {
        let content = ``;
        if (scope._asm_data[variableData.declaration.relid]) {
            return '';
        }
        ;
        content += new accessor_1.Accessor().toAssemblyData(variableData.declaration, scope);
        scope._asm_data[variableData.declaration.relid] = true;
        return content;
    }
}
exports.Variable = Variable;
;
