"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLiteral = exports.ObjectLiteral = void 0;
exports.toPaddedBytes = toPaddedBytes;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const accessor_1 = require("~/features/accessor");
const util_1 = require("~/util");
function toPaddedBytes(data, tabs = 8, row = 8) {
    let wrap = row;
    return Array.from(data).map(c => {
        return `0x${c.charCodeAt(0).toString(16)}`;
    }).map((v) => {
        if (wrap++ >= row) {
            wrap = 0;
            return `\\\n${('\t').repeat(tabs)}${v}`;
        }
        ;
        return v;
    }).join(', ');
}
;
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
                ], 'export': 'fields', 'required': false
            },
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
        ]);
    }
    ;
    create = ObjectLiteral.create;
    static create(data, scope, position) {
        const objectData = { fields: [] };
        for (const field of data.fields ?? []) {
            const value = accessor_1.Accessor.create(field.value, scope, position).export;
            objectData.fields.push({
                name: field.name,
                value: value,
            });
        }
        ;
        objectData.id = scope.alias(scope.generateRandomId());
        scope.set(`literal.${objectData.id}`, objectData);
        return { scope: scope, export: objectData };
    }
    ;
    toAssemblyData(objectData, scope) {
        let content = '';
        if (scope._asm_data[objectData.id]) {
            return '';
        }
        ;
        content += `
/* Object Literal */
${objectData.id}:
	${objectData.fields.map((field) => {
            util_1.Util.debug(field);
            return `
${(new accessor_1.Accessor).toAssemblyData(field.value, scope)}
		`;
        }).join('')}
		`;
        return content;
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
        if (scope._asm_data[stringLiteralData.id]) {
            return '';
        }
        ;
        let content = `
${stringLiteralData.id}:
	.4byte ${toPaddedBytes(stringLiteralData.data, 2, 16)}
	${stringLiteralData.id}_len = . - ${stringLiteralData.id} 
		`;
        return content;
    }
}
exports.StringLiteral = StringLiteral;
;
