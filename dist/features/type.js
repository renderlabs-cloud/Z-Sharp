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
    static get(data, scope, position) {
        if (data?.type?.alias) {
            const alias = identifier_1.Identifier.create(data.type.alias, scope, position).export;
            const name = scope.flatten(alias.path);
            return scope.get(`type.${scope.resolve(name)}`) || null;
        }
        ;
        return null;
    }
    ;
    static toString(type) {
        let content = '';
        if (type?.name) {
            content += type.name;
        }
        ;
        if (type?.generic?.length) {
            content += '<';
            content += type.generic.map((v) => {
                return Type.toString(v);
            }).join(', ');
            content += '>';
        }
        ;
        if (type?.fields && !type.name) {
            content += '{';
            content += type.fields.value?.map((v) => {
                return `${v.name}: ${Type.toString(v.type)}`;
            }).join(', ');
            content += '}';
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
        function listComponentCompatible(list1, list2) {
            if (list1?.size == list2?.size || (list1?.size == null && list2?.size !== undefined)) {
                if (list1?.next && list2?.next) {
                    return Type.isCompatible(list1.next, list2?.next);
                }
                else {
                    return true;
                }
                ;
            }
            ;
            return false;
        }
        ;
        delete type1.typeRef;
        delete type2.typeRef;
        if (lodash_1.default.isEqual(type1, type2)) {
            return true;
        }
        ;
        if (!listComponentCompatible(type1?.list, type2?.list)) {
            return false;
        }
        ;
        return true;
    }
    ;
    static incompatible(type1, type2, position) {
        util_1.Util.error(new error_1.Errors.Syntax.Generic(`Type ${Type.toString(type2)} is incompatible with type ${Type.toString(type1)}`, position));
    }
    ;
    create = Type.create;
    static create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        typeData.id = scope.alias(data.name);
        if (data.type.fields) {
            let typeFields = { value: [], id: typeData.id };
            for (const i in data.type.fields) {
                const item = data.type.fields[i];
                if (!item.comma && Number(i) < data.type.fields.length - 1) {
                    util_1.Util.error(new error_1.Errors.Syntax.Generic(data.type.fields[String(Number(i) + 1)], position));
                }
                ;
                item.id = scope.alias(item.name);
                let _type = Type.get(item.typeRef, scope, position);
                if (!_type) {
                    util_1.Util.error(new error_1.Errors.Reference.Undefined(item.typeRef, position));
                }
                ;
                item.type = _type;
                // Check if type is defined
                if (typeFields.value?.map((v) => {
                    return v?.name == item?.name && v && item;
                }).includes(true)) {
                    util_1.Util.error(new error_1.Errors.Syntax.Duplicate(item.name, position));
                }
                ;
                scope.set(`type_field.${item.id}`, _type);
                typeFields.value?.push(item);
            }
            ;
            typeData.fields = typeFields;
        }
        ;
        scope.set(`type.${typeData.id}`, typeData);
        return { scope, export: typeData };
    }
    ;
    toAssemblyData(typeData, scope) {
        let content = `TYPE ${typeData?.id}\n`;
        for (const field of typeData.fields?.value || []) {
            content += '\tTYPE_FIELD ';
            if (field.type.name == 'byte') {
                content += `BYTE, ${field.name}, ${field.type.list?.size || ''}\n`;
            }
            else {
            }
            ;
            content += `// ??? \n`;
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
        if (data?.type?.alias) {
            typeRef = Type.get(data, scope, position) ?? {};
        }
        ;
        if (data?.list) {
            const list = list_1.List.create(data.list, scope, position).export;
            const subType = {};
            subType.list = subType.list?.next?.list;
            list.next = subType;
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
