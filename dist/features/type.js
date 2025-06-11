"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeValidation = exports.TypeRef = exports.Type = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const error_1 = require("~/error");
const identifier_1 = require("~/features/identifier");
const list_1 = require("~/features/list");
class Type extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'type' } },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'part': { 'type': parts_1.Parts.PartType.EQUALS } },
            {
                'or': [
                    [
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
        if (data?.type?.alias) {
            const alias = identifier_1.Identifier.create(data.type.alias, scope, {}).export;
            const name = scope.flatten(alias.path);
            return scope.get(`type.${scope.resolve(name)}`);
        }
        ;
    }
    ;
    create = Type.create;
    static create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        typeData.id = scope.alias(data.name);
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
        scope.set(`type.${typeData.id}`, typeData);
        return { scope, export: typeData };
    }
    ;
    toAssemblyText(typeData, scope) {
        let content = `
TYPE ${typeData?.id}
		`; // ? should not be required here!
        for (const _field of typeData?.fields || []) { // || should not be require here!
            const field = _field;
            content += `
	TYPE_FIELD 
			`;
            const fieldType = Type.get(field.typeRef, scope);
            if (!fieldType) {
                throw new error_1.Errors.Reference.Undefined(field.name, field.position);
            }
            ;
            if (fieldType.typeRef.type?.alias.name == 'byte') {
                content += 'BYTE, ';
            }
            else {
                if (fieldType.typeRef.type.alias) {
                    const alias = scope.get(`type.${scope.resolve(scope.flatten(fieldType.typeRef.type.alias.path))}`);
                    content += `${alias.id}, `;
                }
                else {
                    // Add more cases
                }
                ;
            }
            ;
            content += `
${fieldType.id}, 
			`;
        }
        ;
        content += `
TYPE_END
		`;
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
                ], 'export': 'type',
            },
            {
                'repeat': [
                    { 'feature': { 'type': list_1.List }, 'export': 'list' }
                ], 'export': 'lists', 'required': false
            }
        ]);
    }
    ;
}
exports.TypeRef = TypeRef;
;
var TypeValidation;
(function (TypeValidation) {
    function expects(type, expected) {
        if (type !== expected) {
            throw new error_1.Errors.Reference.TypeMismatch(type.name || '', {}); // TODO: position
        }
        ;
        return type === expected;
    }
    TypeValidation.expects = expects;
    ;
})(TypeValidation || (exports.TypeValidation = TypeValidation = {}));
;
