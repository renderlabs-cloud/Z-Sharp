"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeRef = exports.Type = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const error_1 = require("~/error");
const identifier_1 = require("~/features/identifier");
class Type extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'type' } },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.EQUALS } },
                        { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
                        { 'repeat': [
                                { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
                                { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                                { 'feature': { 'type': TypeRef }, 'export': 'type' },
                                { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
                            ], 'export': 'fields' },
                        { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
                    ],
                ], 'export': 'type' }
        ]);
    }
    ;
    create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        if (data.type.fields) {
            let fields = [];
            for (const i in data.type.fields) {
                const item = data.type.fields[i];
                if (!item.comma && Number(i) < data.type.fields.length - 1) {
                    throw new error_1.Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
                }
                ;
                // Check if type is defined
                if (fields.map((v) => {
                    return v?.name == item?.name && v && item;
                }).includes(true)) {
                    throw new error_1.Errors.Syntax.Duplicate(item.name, position);
                }
                ;
                fields.push(item);
            }
            ;
            typeData.fields = fields;
        }
        ;
        scope.set(`type.${typeData.name}`, typeData);
        return { scope, exports: typeData };
    }
    ;
    static toAssembly(typeData, scope) {
        let content = `TYPE ${typeData?.name}\n`; // ? should not be required here!
        if (typeData.fields) {
            for (const field of typeData.fields || []) { // || should not be require here!
                content += '\tTYPE_FIELD ';
                content += `${field.name}, `;
                if (field.type?.name == 'byte') {
                    content += 'BYTE, ';
                }
                else {
                    // Verify type exists
                    content += `${field.type.type.type.name}, `;
                }
                ;
                content += '\n';
            }
            ;
        }
        ;
        content += 'TYPE_END';
        return content;
    }
    ;
}
exports.Type = Type;
;
class TypeRef extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'or': [
                    [
                        { 'feature': { 'type': identifier_1.Identifier }, 'export': 'type' },
                    ],
                    [
                        { 'repeat': [
                                { 'part': { 'type': parts_1.Parts.PartType.SQUARE_BRACKET_OPEN } },
                                { 'part': { 'type': parts_1.Parts.PartType.NUMBER }, 'required': false, 'export': 'size' },
                                { 'part': { 'type': parts_1.Parts.PartType.SQUARE_BRACKET_CLOSE } },
                            ], 'export': 'size' }
                    ]
                ], 'export': 'type'
            }
        ]);
    }
    ;
}
exports.TypeRef = TypeRef;
;
