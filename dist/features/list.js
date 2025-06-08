"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class List extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.SQUARE_BRACKET_OPEN } },
            {
                'or': [
                    [
                        { 'part': { 'type': parts_1.Parts.PartType.NUMBER }, 'export': 'length', 'required': false }
                    ],
                ]
            },
            { 'part': { 'type': parts_1.Parts.PartType.SQUARE_BRACKET_CLOSE } }
        ]);
    }
    ;
    static create(data, scope, position) {
        let listData = { size: data.length };
        return { scope, export: listData };
    }
    ;
}
exports.List = List;
;
