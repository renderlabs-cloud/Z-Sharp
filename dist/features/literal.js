"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLiteral = exports.ObjectLiteral = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const accessor_1 = require("~/features/accessor");
class ObjectLiteral extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
            {
                'repeat': [
                    { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
                    { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                    { 'feature': { 'type': accessor_1.Accessor }, 'export': 'value' },
                    { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'export': 'comma', 'required': false },
                ], 'export': 'fields', 'required': false // Not like we are going to have a type with no fields though
            },
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
        ]);
    }
    ;
    create = ObjectLiteral.create;
    static create(data, scope, position) {
        const objectData = { fields: [] };
        for (const field of data.fields) {
            objectData.fields.push({
                name: field.name,
                value: field.value
            });
        }
        ;
        objectData.id = scope.alias(scope.generateRandomId());
        scope.set(`literal.${objectData.id}`, objectData);
        return { scope: scope, export: objectData };
    }
    ;
}
exports.ObjectLiteral = ObjectLiteral;
;
class StringLiteral extends feature_1.Feature.Feature {
    constructor() {
        super([
            {
                'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.DOUBLE_QUOTE_STRING }, 'export': 'data' },
                    ],
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.SINGLE_QUOTE_STRING }, 'export': 'data' },
                    ],
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.BACKTICK_QUOTE_STRING }, 'export': 'data' }, // Implement backtick interpolation
                    ]
                ], 'export': 'string'
            }
        ]);
    }
    ;
    create = StringLiteral.create;
    static create(data, scope, position) {
        const stringData = {};
        stringData.data = data.string.data.slice(1, -1);
        stringData.id = scope.alias(`${scope.generateRandomId()}`);
        scope.set(`literal.${stringData.id}`, stringData);
        return { scope, export: stringData };
    }
    ;
    toAssemblyData(stringLiteralData, scope) {
        let content = `
${stringLiteralData.id}:
	.asciz "${stringLiteralData.data}"
		`;
        return content;
    }
}
exports.StringLiteral = StringLiteral;
;
