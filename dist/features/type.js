"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
const error_1 = require("~/error");
const identifier_1 = require("~/features/identifier");
class Type extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.WORD, 'value': 'type' } },
            { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'name' },
            { 'part': { 'type': parts_1.Parts.PartType.EQUALS } },
            { 'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
                        { 'repeat': [
                                { 'part': { 'type': parts_1.Parts.PartType.WORD }, 'export': 'property' },
                                { 'part': { 'type': parts_1.Parts.PartType.COLON } },
                                { 'feature': { 'type': identifier_1.Identifier }, 'export': 'type' },
                                { 'part': { 'type': parts_1.Parts.PartType.COMMA }, 'required': false, 'export': 'comma' }
                            ], 'export': 'structure' },
                        { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
                    ]
                ] },
            { 'part': { 'type': parts_1.Parts.PartType.SEMICOLON } }
        ]);
    }
    ;
    create(data, scope, position) {
        const typeData = {};
        typeData.name = data.name;
        if (data.structure) {
            let structure = [];
            for (const i in data.structure) {
                const item = data.structure[i];
                if (!item?.comma && Number(i) < data.structure.length - 1) {
                    throw new error_1.Errors.Syntax.Generic(data.structure[String(Number(i) + 1)], position);
                }
                ;
                if (structure.map((v) => {
                    return v?.name == item?.name;
                }).includes(true)) {
                    throw new error_1.Errors.Syntax.Duplicate(item.name, position);
                }
                ;
                item.type = item.type.location;
                structure.push(item);
            }
            ;
            scope.set(`type.${typeData.name}`, typeData);
        }
        ;
        return { scope };
    }
    ;
}
exports.Type = Type;
;
