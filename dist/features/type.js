"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeRef = exports.Type = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const error_1 = require("~/error");
const identifier_1 = require("~/features/identifier");
const list_1 = require("~/features/list");
const util_1 = require("~/util");
const lodash_1 = __importDefault(require("lodash"));
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
            return scope.get(`type.${scope.resolve(name)}`) || null;
        }
        ;
        return null;
    }
    ;
    static toString(type) {
        let content = '';
        content += type.name;
        if (type?.generic?.length) {
            content += '<';
            content += type.generic.map((v) => {
                return Type.toString(v);
            }).join(', ');
            content += '>';
        }
        ;
        if (type?.list) {
            content += '[';
            if (type.list.size) {
                content += type.list.size;
            }
            ;
            content += ']';
        }
        ;
        /** TODO:
         * ...
         */
        return content;
    }
    ;
    static isCompatible(type1, type2) {
        delete type1.typeRef;
        delete type2.typeRef;
        if (type1 == type2) {
            return true;
        }
        ;
        if (type1?.list && type2?.list && lodash_1.default.isEqual({ ...type1, list: null }, { ...type2, list: null })) {
            return type1?.list?.size == undefined;
        }
        ;
        if (type1?.generic?.length == type2?.generic?.length) {
            return type1?.generic?.every((v, i) => {
                return Type.isCompatible(v, type2.generic?.[i] || {}); // This will return false next iteration
            }) || false;
        }
        ;
        return false;
    }
    ;
    static incompatible(type1, type2, position) {
        throw new error_1.Errors.Syntax.Generic(`Type ${Type.toString(type2)} is incompatible with type ${Type.toString(type1)}`, position);
    }
    ;
    create = Type.create;
    static create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        typeData.id = scope.alias(data.name);
        if (data.type.fields) {
            let typeFields = { fields: [], id: typeData.id, name: typeData.name };
            for (const i in data.type.fields) {
                const item = data.type.fields[i];
                if (!item.comma && Number(i) < data.type.fields.length - 1) {
                    throw new error_1.Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position);
                }
                ;
                item.id = scope.alias(item.name);
                // Check if type is defined
                if (typeFields.fields?.map((v) => {
                    return v?.name == item?.name && v && item;
                }).includes(true)) {
                    throw new error_1.Errors.Syntax.Duplicate(item.name, position);
                }
                ;
                scope.set(`type_field.${item.id}`, item);
                typeFields.fields?.push(item);
            }
            ;
            typeData.fields = typeFields;
        }
        ;
        scope.set(`type.${typeData.id}`, typeData);
        return { scope, export: typeData };
    }
    ;
    toAssemblyText(typeData, scope) {
        let content = `
TYPE ${typeData?.id}
		`;
        for (const _field of typeData.fields?.fields || []) {
            const field = _field;
            content += `
	TYPE_FIELD 
			`;
            const fieldType = Type.get(field.typeRef, scope);
            if (!fieldType) {
                throw new error_1.Errors.Reference.Undefined(field.name, field.position);
            }
            ;
            if (fieldType.name == 'byte') {
                content += 'BYTE, ';
            }
            else {
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
                    [
                        { 'feature': { 'type': TypeRef }, 'export': 'typeRef' }
                    ]
                ], 'export': 'type',
            },
            { 'feature': { 'type': list_1.List }, 'export': 'list', 'required': false }
        ]);
    }
    ;
    create = TypeRef.create;
    static create(data, scope, position) {
        let typeRef = {};
        util_1.Util.debug(`Data`, data);
        if (data?.type?.alias) {
            typeRef = Type.get(data, scope) || {};
            util_1.Util.debug(`TypeRef from alias created`, typeRef);
        }
        ;
        if (data?.list) {
            const list = list_1.List.create(data.list, scope, position).export;
            const subType = {};
            subType.list = subType.list?.type?.list;
            list.type = subType;
            typeRef.list = list;
        }
        ;
        /** TODO:
         * ...
        */
        return { scope, export: typeRef };
    }
    ;
}
exports.TypeRef = TypeRef;
;
