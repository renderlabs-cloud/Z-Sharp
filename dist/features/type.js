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
            {
                'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.EQUALS } },
                        { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
                        {
                            'repeat': [
                                { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
                                { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                                { 'feature': { 'type': TypeRef }, 'export': 'typeRef' },
                                { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
                            ], 'export': 'fields'
                        },
                        { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
                    ],
                    [
                        { 'feature': { 'type': TypeRef }, 'export': 'alias' }
                    ]
                ], 'export': 'type'
            }
        ]);
    }
    ;
    static get(data, scope) {
        if (data.type.alias) {
            return scope.get(`type.${scope.resolve(data.type.alias.name)}`);
        }
        ;
    }
    ;
    create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        typeData.id = `type.${scope.alias(data.name)}`;
        if (data.type.fields) {
            let fields = [];
            for (const i in data.type.fields) {
                const item = data.type.fields[i];
                if (!item.comma && Number(i) < data.type.fields.length - 1) {
                    throw new error_1.Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
                }
                ;
                item.id = `type_field.${scope.alias(item.name)}`;
                // Check if type is defined
                if (fields.map((v) => {
                    return v?.name == item?.name && v && item;
                }).includes(true)) {
                    throw new error_1.Errors.Syntax.Duplicate(item.name, position);
                }
                ;
                scope.set(item.id, item);
                fields.push(item);
            }
            ;
            typeData.fields = fields;
        }
        ;
        scope.set(typeData.id, typeData);
        return { scope, exports: typeData };
    }
    ;
    toAssembly(typeData, scope) {
        let content = `TYPE ${typeData?.id}\n`; // ? should not be required here!
        if (typeData.fields) {
            for (const _field of typeData.fields || []) { // || should not be require here!
                const field = _field;
                content += '\tTYPE_FIELD ';
                const type = scope.get(field.id);
                if (!type) {
                    throw new error_1.Errors.Reference.Undefined(field.name, field.position);
                }
                ;
                if (type.typeRef.type?.alias.name == 'byte') {
                    content += 'BYTE, ';
                }
                else {
                    if (type.typeRef.type.alias) {
                        const alias = scope.get(`type.${scope.resolve(type.typeRef.type.alias.name)}`);
                        content += `${alias.id}, `;
                    }
                    else {
                        // Add more cases
                    }
                    ;
                }
                ;
                content += `${type.id}, `;
                content += '\n';
            }
            ;
        }
        ;
        content += 'TYPE_END\n';
        return content;
    }
    ;
}
exports.Type = Type;
;
class TypeRef extends feature_1.Feature.Feature {
    constructor() {
        super([
            {
                'or': [
                    [
                        { 'feature': { 'type': identifier_1.Identifier }, 'export': 'alias' },
                    ],
                    /*	[
                            {
                                'repeat': [
                                    { 'part': { 'type': Parts.PartType.SQUARE_BRACKET_OPEN } },
                                    { 'part': { 'type': Parts.PartType.NUMBER }, 'required': false, 'export': 'size' },
                                    { 'part': { 'type': Parts.PartType.SQUARE_BRACKET_CLOSE } },
                                ], 'export': 'size'
                            }
                        ]*/ // Replace with features/array.ts
                ], 'export': 'type',
            }
        ]);
    }
    ;
}
exports.TypeRef = TypeRef;
;
