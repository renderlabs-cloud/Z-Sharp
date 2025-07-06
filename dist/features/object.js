"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Object = void 0;
const feature_1 = require("~/feature");
const parts_1 = require("~/parts");
class _Object extends feature_1.Feature.Feature {
    constructor() {
        super([
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_OPEN } },
            // TODO: key: typeRef, value: typeRef
            { 'part': { 'type': parts_1.Parts.PartType.CURLY_BRACKET_CLOSE } }
        ]);
    }
    ;
    create = _Object.create;
    static create(data, scope, position) {
        return { export: data, scope };
    }
    ;
}
exports._Object = _Object;
;
